import time

# ──────── Evaluation Metrics Logic ─────────

class EvaluationMetrics:
    def __init__(self):
        self.start_time = None
        self.total_tasks = 0
        self.completed_tasks = 0
        self.total_progress = 0
        self.task_time = 0

    def start_task(self):
        self.start_time = time.time()
        self.total_tasks += 1

    def end_task(self, success=True, progress_score=3, task_duration=1):
        """
        progress_score: 0-3 scale (0=no progress, 3=complete)
        task_duration: simulated task time in minutes
        """
        if success:
            self.completed_tasks += 1
        self.total_progress += progress_score
        self.task_time = task_duration

    def get_metrics(self):
        """
        Returns a dict with raw AS, CS, TCR, ACT scores.
        """
        task_time = self.task_time or 1
        as_score = self.total_progress / max(1, self.total_tasks * 3)
        cs_score = self.completed_tasks / max(0.01, task_time)
        tcr = min(100, (self.completed_tasks / max(1, self.total_tasks)) * 100)
        act = task_time / max(1, self.completed_tasks or 1)

        return {
            "AS": as_score,
            "CS": cs_score,
            "TCR": tcr,
            "ACT": act
        }

    def format_metrics(self):
        """
        Returns human‑readable strings for each metric.
        """
        m = self.get_metrics()
        return {
            "Average Progress Score (AS)":    f"{m['AS']:.2f} score",
            "Completion Speed (CS)":          f"{m['CS']:.2f} score/min",
            "Task Completion Rate (TCR)":     f"{m['TCR']:.2f}%",
            "Average Completion Time (ACT)":  f"{m['ACT']:.2f} min"
        }

# Simulated task durations for each model (in minutes)
models = {
    "qwen-2.5-32b": 1.2,
    "llama-3.3-70b-versatile": 1.5,
    "gemma2-9b-it": 1.0,
    "deepseek-r1-distill-qwen-32b": 1.3,
    "gemini-1.5-flash-latest": 1.0,
    # You can add Gemini model names here with their simulated durations
    "gemini-pro": 1.0,
    "gemini-1.5-pro": 1.2
}

