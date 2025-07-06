async function run(prompt, language, model) {
  try {
	// const url = "http://localhost:8000/generate-recipe";
	const url = "https://miraagent.pythonanywhere.com/generate-recipe";

    const refineResponse = await fetch(url,
		 {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "cors", 
      body: JSON.stringify({ 
        recipe_name: prompt, 
        language_option: language,
        model: model 
      }),
    });

    if (!refineResponse.ok) {
      throw new Error(`Failed to get response: ${refineResponse.status}`);
    }
    
    const refineData = await refineResponse.json();
    console.log("API Response:", refineData);
    
    if (!refineData.recipe) {
      throw new Error("No recipe data in response");
    }
    const { recipe, metrics } = refineData;

    const returningData  = {
      recipe: { ...recipe, metrics },
    };
    console.log(returningData)

    return returningData.recipe;

  } catch (error) {
    console.error("Error fetching responses:", error);
    return "❌ An error occurred while fetching responses. Please try again.";
  }
}

export default run;