import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from mira.agent import run_agent


from mira.init import EvaluationMetrics

# Load .env for credentials if you like
load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route("/generate-recipe", methods=["POST"])
def generate_recipe():
    data  = request.get_json()
    name  = data.get("recipe_name")
    lang  = data.get("language_option")
    model = data.get("model")  # optional override: "groq" or "gemini"
    print("doign this")
    try:
        print("running model")
        recipe = run_agent(name, lang, model)
        # Calculate metrics
        evaluator = EvaluationMetrics()
        evaluator.start_task()
        evaluator.end_task(success=True, progress_score=3, task_duration=1) 
        metrics = evaluator.get_metrics()
        return {
            "recipe": recipe,
            "metrics": {
                "AS": round(metrics['AS'], 2),
                "CS": round(metrics['CS'], 2),
                "TCR": round(metrics['TCR'], 2),
                "ACT": round(metrics['ACT'], 2)
            }
        }
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # respects $PORT or defaults to 8000
    port = int(os.getenv("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
