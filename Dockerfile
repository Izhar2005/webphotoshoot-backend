FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "backend.app:app"]
