FROM node:lts-slim

ENV USER=wintecitbot

RUN apt update && \
    apt-get -y install --no-install-recommends iputils-ping openssl && \
    apt-get purge -y --auto-remove && \
    rm -rf /var/lib/apt/lists/*

RUN groupadd -r ${USER} && \
    useradd --create-home --home /home/${USER} -r -g ${USER} ${USER}

USER ${USER}
WORKDIR /home/${USER}

COPY --chown=${USER}:${USER}  . .

RUN rm -rf node_modules && \
    npm ci && \

COPY --chown=${USER}:${USER} package*.json ./

# Run the app when the container launches
CMD ["npm", "run", "start:migrate:prod"]