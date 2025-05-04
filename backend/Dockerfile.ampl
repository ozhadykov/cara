FROM python:3.9.22-bullseye

# Set the workdir 
WORKDIR /ampl

# Copy the application code into the container
COPY ./ampl_app/requirements.txt /ampl/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Installing amplpy
RUN python -m pip install amplpy --no-cache-dir
RUN python -m amplpy.modules install highs gurobi --no-cache-dir
RUN python -m amplpy.modules install cplex

COPY ./ampl_app /ampl/app

# docs
EXPOSE 8000

# Start the Fast API
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]