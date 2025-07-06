def build_prompt(language_option, recipe_name, model):
      
   prompt_template = f"""
  You are an AI agent for the purpose of temporal reasoning. Your name is MIRA AI agent. You have to follow the protocols listed in MIRA PROTOCOL. I'll give you a list of available Objects (OBJ) and Valid Actions. Pickout correct objects M¯im¯ams¯a Inspired Framework- Temporal Reasonin from the list of Available Objects. Each action duration (DUR) is also given in valid action. The starting condition (START) and the end goal (FINAL GOAL) for the sequence is also given. With these you have to generate a sequence of instructions for the given task description. For each instruction also provide the type (TYPE) of instruction from MIRA PROTOCOL

   Recipe Name: {recipe_name}

   TYPE: NON INSTRUCTION 
   • Example: Brown ground meat and onion in a large pot
   TYPE: SIMPLE INSTRUCTION
   • Instructions can include one object or multiple objects (e.g. take pen or take pens and papers).
   • Example: Add beef broth and celery
   TYPE: SEQUENTIAL INSTRUCTION
   • If two actions are provided in a sequence, use “then” and do not use “and” (e.g. Take pen then write).
   • Example: Cover the pot then simmer for 20 minutes
   TYPE: INSTRUCTION WITH REASON
   • The instruction includes an action followed by a reason or condition.
   • Example: Add a little salt to taste during the last hour of cooking
   TYPE: INSTRUCTION WITH PURPOSE
   • Each instruction can include a goal—here the instruction should have the intention of goal perspective (e.g. Take pen if you want to write).
   • Example: Let it stand in a cool place if your intention is to make it firm
   TYPE: EXCLUSIVE INSTRUCTION
   • Each instruction can include multiple objects which are exclusive (e.g. take pen or pencil).
   • If there are options between actions, include "or" within that instruction.
   • Example: Heat the oil or margarine in a soup pot
   TYPE: INSTRUCTION WITH RESTRICTION
   • These instructions have a condition or limit applied to how the action must be performed.
   • Example: Add the reserved liquid only until the desired consistency is reached
   TYPE: MANDATORY INSTRUCTION
   • Instructions that must be followed strictly. The action is compulsory.
   • Example: You must add the onion and garlic
   TYPE: PARALLEL INSTRUCTION
   • Two or more actions or objects are handled simultaneously.
   • Example: Cream the sugar and the butter simultaneously until light and whipped
   TYPE: INSTRUCTION WITH REASON AND PURPOSE
   • The instruction includes both a reason and an intended outcome.
   • Example: Add more soy sauce if needed, to enhance the taste
   TYPE: INSTRUCTION WITH REASON WITH RESTRICTION
   • Action is performed under a restriction, and also includes a reason or condition.
   • Example: Working in batches, puree in a blender until thick and smooth
   TYPE: INSTRUCTION WITH SEQUENCE WITH RESTRICTION
   • Two actions are done in a sequence, with some restriction/condition on how it is done.
   • Example: Dip chicken pieces into soup mixture then turn only to coat all over

   give the result in this format 
   1. Instruction
   <span style="color:green"> Type: Simple Instruction </span> (Its classification)
   ...


   Available Objects = {{Slices of bread White bread, Whole wheat bread, Multi-grain
   bread, Condiments, Mayonnaise, Mustard, Butter, Ketchup, Spreads, Vegetables,
   Meat, Cheese, Sandwich maker, Grill, Water, Teapot 
   
   Valid Actions = {{ Take OBJ: DUR 1 minute, Heat OBJ: DUR 3 minutes, Pickup

   Now, generate the step-by-step instructions for {recipe_name} following the above structured format.
      """

   return prompt_template