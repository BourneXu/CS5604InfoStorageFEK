FROM ubuntu:latest
RUN apt-get update \
    && apt-get install -y python3-pip python3-dev \
    && cd /usr/local/bin \
    && ln -s /usr/bin/python3 python \
    && pip3 install --upgrade pip \
    && export ENV_FOR_DYNACONF=prod

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt
RUN pip3 install dynaconf[all]
ENTRYPOINT ["python3"]
CMD ["app.py"]