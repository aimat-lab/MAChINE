# Start your image with a node base image
FROM python:3.10-bullseye

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY ./backend/requirements.txt ./

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN pip install -r requirements.txt

# Copy local directories to the current local directory of our docker image (/app)
COPY ./backend ./backend
COPY ./run_backend.py ./

WORKDIR ./backend

EXPOSE 5000

# Start the app using serve command
CMD [ "python", "../run_backend.py", "-O" ]