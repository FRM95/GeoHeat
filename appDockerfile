FROM python:3.10-slim

USER root
RUN mkdir /app
COPY ./requirements.txt /app
WORKDIR /app
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./src /app/src
WORKDIR /app/src

ENV FLASK_APP=app.py
ENV FLASK_DEBUG=1

CMD ["flask", "run", "--host=0.0.0.0"]