sudo rm -rf build/ build.gz build_p.gz
sudo npm run build
sudo tar -cvf build_p.gz build/
aws s3 cp build_p.gz s3://shenzyn-code/frontend/build_p.gz
