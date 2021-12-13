sudo rm -rf build/ build.gz build_p.gz
# sudo mv .env.production .env.production.tmp
# sudo cp .env.stage .env.production
sudo npm run build:stage
# sudo mv .env.production.tmp .env.production
sudo tar -cvf build_p.gz build/
#gsutil cp build_p.gz gs://shenzyn-code/build_p.gz
aws s3 cp build_p.gz s3://shenzyn-code/frontend/build_p_stage.gz