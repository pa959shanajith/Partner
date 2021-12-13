move .env.production.tmp .env.production
tar -czvf build_p.gz build/*
aws s3 cp build_p.gz s3://shenzyn-code/frontend/build_p_stage.gz