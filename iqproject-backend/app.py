from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import json
import os
from flask_migrate import Migrate


from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView


app = Flask(__name__)
CORS(app)

# Configuration base de données SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///questions.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db) 


# Modèle Question
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(50), nullable=False)
    question = db.Column(db.Text, nullable=False)
    choices = db.Column(db.Text, nullable=False)  # Stocké en JSON
    answer = db.Column(db.String(100), nullable=False)
    difficulty = db.Column(db.String(20), nullable=False, default='medium')
    category = db.Column(db.String(20), nullable=False, default='qi')  # ou 'quizz' selon le cas


    def __repr__(self):
        return f'<Question {self.id}: {self.question[:30]}...>'



# Vérifie la structure d'une question
def is_valid_question(data):
    return (
        isinstance(data, dict) and
        'type' in data and
        'question' in data and
        'choices' in data and
        'answer' in data and
        isinstance(data['choices'], list)
    )                                                                                                                                                                                

class Response(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(100), nullable=False)  # utilisateur anonyme
    question_id = db.Column(db.Integer, db.ForeignKey('question.id'), nullable=False)
    selected_answer = db.Column(db.String(100), nullable=False)







# Route d'import depuis un fichier JSON lo cal
@app.route('/import-questions', methods=['POST'])
def import_questions():
    try:
        with open("questions.json", "r", encoding="utf-8") as f:
            questions = json.load(f)

        inserted = 0
        skipped = 0

        for q in questions:
            if not is_valid_question(q):
                skipped += 1
                continue

            # Évite les doublons
            existing = Question.query.filter_by(question=q['question']).first()
            if existing:
                skipped += 1
                continue

            new_q = Question(
                type=q['type'],
                difficulty=q['difficulty'], 
                question=q['question'],
                choices=json.dumps(q['choices']),
                answer=q['answer'],
                category=q['category']
            )
            db.session.add(new_q)
            inserted += 1

        db.session.commit()

        return jsonify({
            "message": "Import terminé ✅",
            "insérées": inserted,
            "ignorées": skipped
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_appreciation(iq):
    if iq >= 130:
        return "Génie 💡"
    elif iq >= 120:
        return "Très supérieur 💪"
    elif iq >= 110:
        return "Au-dessus de la moyenne 👍"
    elif iq >= 90:
        return "Moyenne 🙂"
    elif iq >= 80:
        return "Légèrement en dessous de la moyenne 🤔"
    elif iq >= 70:
        return "Limite... besoin de concentration 🧠"
    else:
        return "En difficulté 😓 - continue de t'entraîner !"



# Route test

import random

@app.route('/generate-test')
def generate_test():
    test_type = request.args.get('type', 'verbal')

    # Définir le nombre de questions selon le type
    if test_type == 'easy':
        question_limit = 10
    elif test_type == 'mid':
        question_limit = 20
    elif test_type == 'complete':
        question_limit = 30
    else:
        return jsonify({"error": "Type de test invalide"}), 400

    # Sélection aléatoire des questions
    questions = Question.query.order_by(db.func.random()).limit(question_limit).all()

    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "type": q.type,
            "question": q.question,
            "choices": json.loads(q.choices),
            "answer": q.answer
        })

    return jsonify(result)



@app.route('/generate-quizz')
def generate_quizz():
    category = request.args.get('type')         # ex: 'global', 'verbal', etc.
    difficulty = request.args.get('difficulty') # ex: 'easy', 'medium', 'hard', 'random'

    if not category or not difficulty:
        return jsonify({"error": "Paramètres 'type' et 'difficulty' requis"}), 400

    question_limit = 10

    # Cas spécial : difficulté "random" => on ignore le champ difficulty
    if difficulty == 'random':
        questions = Question.query.filter_by(type=category, category='quizz') \
                                   .order_by(db.func.random()) \
                                   .limit(question_limit) \
                                   .all()
    else:
        questions = Question.query.filter_by(type=category, difficulty=difficulty, category='quizz') \
                                   .order_by(db.func.random()) \
                                   .limit(question_limit) \
                                   .all()

    result = []
    for q in questions:
        result.append({
            "id": q.id,
            "type": q.type,
            "difficulty": q.difficulty,
            "question": q.question,
            "choices": json.loads(q.choices),
            "answer": q.answer
        })

    return jsonify(result)




from flask import render_template

@app.route('/test')
def test_page():
    return render_template('test.html')

@app.route('/help')
def help_page():
    return render_template('helpcontact.html')

@app.route('/quizz')
def quizz_page():
    return render_template('quizz.html')

@app.route('/results')
def results_page():
        return render_template('results.html')

@app.route('/')
def home_page():
    return render_template('index.html')

@app.route('/iqchoice')
def iqchoice_page():
    return render_template('iqchoice.html')

@app.route('/quizzchoice')
def quizzchoice_page():
    return render_template('quizzchoice.html')

@app.route('/submit-response', methods=['POST'])
def submit_response():
    data = request.get_json()
    try:
        user_id = data['user_id']
        question_id = data['question_id']
        selected_answer = data['selected_answer']

        response = Response(
            user_id=user_id,
            question_id=question_id,
            selected_answer=selected_answer
        )
        db.session.add(response)
        db.session.commit()

        return jsonify({'message': 'Réponse enregistrée ✅'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/view-responses')
def view_responses():
    responses = Response.query.all()
    data = [
        {
            'id': r.id,
            'user_id': r.user_id,
            'question_id': r.question_id,
            'selected_answer': r.selected_answer
        } for r in responses
    ]
    return jsonify(data)




admin = Admin(app, name="interface Admin",
              template_mode="bootstrap3")
admin.add_view(ModelView(Question,db.session))
app.config['SECRET_KEY']='secret'
# Point d'entrée unique
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)




