aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 135437264184.dkr.ecr.ap-south-1.amazonaws.com
docker build -t spinwin-cms-prod .
docker tag spinwin-cms-prod:latest 135437264184.dkr.ecr.ap-south-1.amazonaws.com/spinwin-cms-prod:latest
docker push 135437264184.dkr.ecr.ap-south-1.amazonaws.com/spinwin-cms-prod:latest