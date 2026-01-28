
# Como executar o backend

1. Abra o terminal e navegue até a pasta `app-main/app-main`:
	```sh
	cd app-main/app-main
	```
2. Ative o ambiente virtual, se necessário:
	```sh
	..\.venv\Scripts\activate
	```
3. Execute o backend com um dos comandos abaixo:
	```sh
	python -m backend.server
	# ou
	uvicorn backend.server:app --reload
	```

O servidor estará disponível em http://localhost:8000
