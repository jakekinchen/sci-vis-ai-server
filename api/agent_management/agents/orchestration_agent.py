"""
Orchestration Agent - Breaks down scene scripts into discrete objects for visualization.
"""

import asyncio
import json
from typing import Dict, List, Optional

from agent_management.models import SceneScript, OrchestrationPlan, ThreeGroup, SceneObject
from agent_management.llm_service import (
    LLMService,
    StructuredLLMRequest,
    LLMModelConfig,
    ProviderType
)

class OrchestrationAgent:
    def __init__(self, llm_service: LLMService):
        self.llm_service = llm_service
        # We'll initialize geometry_agent when it's needed (lazy initialization)
        self._geometry_agent = None
    
    def generate_orchestration_plan(self, script: SceneScript) -> OrchestrationPlan:
        """
        Generate an orchestration plan that identifies all discrete objects needed for the scene.
        
        Args:
            script: The scene script to analyze
            
        Returns:
            OrchestrationPlan: A structured plan with all objects needed for the scene
        """
        # Convert the script to a structured format for the LLM prompt
        script_content = "\n\n".join([
            f"{point.description}\nCAPTION: {point.caption}"
            for point in script.content
        ])
        
        # Prepare prompt parts
        prompt_intro = f"Analyze this scene script and identify all discrete 3D objects needed for the visualization:"
        prompt_title = f"SCENE TITLE: {script.title}"
        prompt_content = f"SCRIPT CONTENT:\n{script_content}"
        
        prompt_instructions = """
Based on this script, identify a SMALL NUMBER (1-5 maximum) of key discrete 3D objects that need to be generated for this visualization.

CRITICAL LIMITATION: You must consolidate similar elements into single objects. For example:
- A molecule should be ONE object, not separate objects for each atom
- A scene should have 1-5 TOTAL objects maximum
- Group related components together into more complex single objects

For each object, provide:
1. A unique name that clearly identifies the object (use underscores for spaces)
2. A detailed description as a string (or list of strings) that fully characterizes the object
3. Properties object with detailed attributes like size, color, material, etc.
4. Appears_at field with the MM:SS timecode when this object first appears
5. Relationships as an array of strings listing related objects

Your response should be a MINIMAL list of objects required for the scene, with complex elements consolidated.
Aim for 1-5 total objects for the entire visualization. Fewer, more complex objects is better than many simple objects.

IMPORTANT: EVERY object MUST include ALL of these fields:
- name (string)
- description (string or array of strings)
- properties (object)
- appears_at (string in MM:SS format)
- relationships (array of strings)

Return a JSON object with:
1. scene_title - The title of the scene
2. objects - An array of 1-5 consolidated objects needed, with all required fields

Example response format:
```json
{
  "scene_title": "DNA Structure",
  "objects": [
    {
      "name": "Complete_DNA_Model",
      "description": [
        "Complete double helix structure including all nucleotide bases, sugar-phosphate backbone",
        "Contains all atoms and bonds as a single consolidated object",
        "Forms the central element of the visualization"
      ],
      "properties": {
        "size": {
          "length": "20 units",
          "width": "5 units"
        },
        "color_scheme": "standard biological coloring",
        "material": "glossy"
      },
      "appears_at": "00:15",
      "relationships": ["interacts_with Environment"]
    }
  ]
}
```
"""
        
        # Combine the prompt parts
        full_prompt = f"{prompt_intro}\n\n{prompt_title}\n\n{prompt_content}\n\n{prompt_instructions}"
        
        # Create a request for orchestration planning
        request = StructuredLLMRequest(
            user_prompt=full_prompt,
            
            system_prompt="""You are an expert in 3D visualization planning and asset management. Your task is to analyze scene scripts and identify a MINIMAL set of consolidated objects needed for implementation.

STRICT LIMITATIONS:
- You MUST produce a MAXIMUM of 5 total objects for the entire visualization
- You MUST consolidate related elements (i.e., a molecule is ONE object, not separate atoms)
- Your goal is efficiency: fewer, more complex objects is better than many simple objects

When analyzing scripts:
- Aggressively consolidate related elements into single comprehensive objects
- Aim for 1-5 total objects in the final scene, never more
- Create clear, unique names for each consolidated object using underscores instead of spaces
- Provide very detailed descriptions of the consolidated objects
- Specify comprehensive properties (dimensions, colors, textures, etc.) as an object
- ALWAYS note when each object first appears using appears_at field with MM:SS format 
- ALWAYS include relationships as an array of strings, even if empty
- Think holistically about the complete scene requirements

IMPORTANT: EVERY object MUST include ALL required fields: name, description, properties, appears_at, and relationships.
Always return properly structured JSON objects matching the requested schema exactly.
""",
            llm_config=self.llm_service.config,
            response_model=OrchestrationPlan,
        )
        
        # Get the structured response
        return self.llm_service.generate_structured(request)
    
    async def generate_geometry_from_plan(self, plan: OrchestrationPlan) -> Dict[str, Dict]:
        """
        Generate Three.js geometry for each object in the orchestration plan.
        Processes objects in parallel for improved performance.
        
        Args:
            plan: The orchestration plan containing objects to generate
            
        Returns:
            Dictionary mapping object names to their Three.js geometry
        """
        # Lazy-load the geometry agent
        if self._geometry_agent is None:
            from agent_management.agents.geometry_agent import GeometryAgent
            self._geometry_agent = GeometryAgent(self.llm_service)
        
        results = {}
        failures = []
        
        print(f"Starting to generate geometry for {len(plan.objects)} objects in parallel...")
        
        async def process_object(i, obj):
            """Process a single object and return its result"""
            try:
                print(f"Generating geometry for object {i+1}/{len(plan.objects)}: {obj.name}")
                
                # Format a detailed prompt for this specific object
                obj_prompt = self._format_object_prompt(obj, plan.scene_title)
                
                # Generate the geometry (this will be a string of Three.js code)
                geometry_code = self._geometry_agent.get_geometry_snippet(obj_prompt)
                
                print(f"✓ Successfully generated geometry for {obj.name}")
                
                return obj.name, {
                    "code": geometry_code,
                    "object_info": obj.dict(),
                    "status": "success"
                }
                
            except Exception as e:
                print(f"✗ Failed to generate geometry for {obj.name}: {str(e)}")
                failures.append({
                    "object_name": obj.name,
                    "error": str(e)
                })
                return obj.name, {
                    "object_info": obj.dict(),
                    "status": "failed",
                    "error": str(e)
                }
        
        # Create tasks for all objects
        tasks = [process_object(i, obj) for i, obj in enumerate(plan.objects)]
        
        # Run all tasks concurrently
        object_results = await asyncio.gather(*tasks)
        
        # Process results
        for name, result in object_results:
            results[name] = result
            
        # Add summary information
        results["_summary"] = {
            "total_objects": len(plan.objects),
            "success_count": len([r for r in results.values() if r.get("status") == "success"]),
            "failure_count": len(failures),
            "failures": failures
        }
        
        return results

    def _format_object_prompt(self, obj: SceneObject, scene_title: str) -> str:
        """
        Format a descriptive prompt for the geometry agent based on a scene object.
        
        Args:
            obj: The scene object to generate
            scene_title: The title of the overall scene
            
        Returns:
            A formatted prompt string
        """
        # Format the object properties as a readable string
        properties_str = json.dumps(obj.properties, indent=2)
        
        # Format relationships as a comma-separated string
        relationships_str = ", ".join(obj.relationships) if obj.relationships else "None"
        
        # Create a detailed prompt for the geometry agent
        prompt = f"""
Create a Three.js object for: {obj.name}

SCENE CONTEXT: This object is part of a scene titled "{scene_title}"

DESCRIPTION:
{obj.description}

PROPERTIES:
{properties_str}

RELATIONSHIPS:
{relationships_str}

APPEARS AT: {obj.appears_at}

Create a detailed, accurate 3D representation of this object using Three.js. 
Focus on capturing the key visual characteristics and ensuring it fits with the overall scene.
"""
        return prompt

    def generate_test_questions(self, script: SceneScript):
        """
        Generate multiple choice test questions based on the scene script content.
        
        Args:
            script: The scene script to analyze
            
        Returns:
            JSON object containing test questions, choices, and correct answers
        """
        # Format script content
        script_content = "\n\n".join([
            f"{point.description}\nCAPTION: {point.caption}"
            for point in script.content
        ])
        
        prompt = """
Generate multiple choice test questions based on this educational content.
Each question should test understanding of key concepts from the script.

Return a JSON object with an array of questions, where each question has:
1. question - The actual question text
2. choices - Array of 4 possible answers
3. correct_answer - The correct answer (must match one of the choices exactly)
4. explanation - Brief explanation of why the answer is correct

Example format:
{
  "questions": [
    {
      "question": "What is the primary structure being visualized in this scene?",
      "choices": [
        "DNA double helix",
        "RNA strand",
        "Protein chain",
        "Lipid membrane"
      ],
      "correct_answer": "DNA double helix",
      "explanation": "The scene focuses on visualizing the DNA double helix structure as the main component."
    }
  ]
}
"""
        
        request = StructuredLLMRequest(
            user_prompt=f"SCRIPT CONTENT:\n{script_content}\n\n{prompt}",
            system_prompt="""You are an expert in creating educational assessment questions.
Generate clear, focused multiple choice questions that test understanding of the key concepts.
Ensure all questions:
- Are directly related to the content
- Have exactly 4 choices
- Have one unambiguously correct answer
- Include a brief explanation
Always return properly structured JSON matching the schema exactly.""",
            llm_config=self.llm_service.config
        )
        
        return self.llm_service.generate_structured(request)