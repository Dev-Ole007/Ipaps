from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import firebase_admin
from firebase_admin import credentials, firestore, auth
from datetime import datetime, timezone
import asyncio


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')


# Initialize Firebase Admin (evita inicialização duplicada)
cred = credentials.Certificate(ROOT_DIR / 'firebase_credentials.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Models
class Store(BaseModel):
    id: Optional[str] = None
    name: str
    category: str
    phone: str
    whatsapp: str
    logo: Optional[str] = None
    rating: float = 0.0
    description: Optional[str] = None
    createdAt: Optional[str] = None

class Product(BaseModel):
    id: Optional[str] = None
    storeId: str
    name: str
    price: float
    category: str
    image: Optional[str] = None
    description: Optional[str] = None
    createdAt: Optional[str] = None

class News(BaseModel):
    id: Optional[str] = None
    title: str
    category: str
    content: str
    date: Optional[str] = None
    image: Optional[str] = None
    createdAt: Optional[str] = None

class Professional(BaseModel):
    id: Optional[str] = None
    name: str
    service: str
    phone: str
    whatsapp: str
    photo: Optional[str] = None
    specialty: Optional[str] = None
    createdAt: Optional[str] = None

class Trip(BaseModel):
    id: Optional[str] = None
    time: str
    price: float
    route: str
    driverName: str
    driverPhone: str
    createdAt: Optional[str] = None

class SloganRequest(BaseModel):
    storeName: str
    category: str
    description: Optional[str] = None

class AuthUser(BaseModel):
    email: str
    password: str

# Auth middleware
async def verify_firebase_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        logger.error(f"Auth error: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication")

# Routes
@api_router.get("/")
async def root():
    return {"message": "Ipaporanga Hub API", "status": "online"}

# Stores
@api_router.post("/stores", response_model=Store)
async def create_store(store: Store):
    try:
        store_dict = store.model_dump(exclude={'id'})
        store_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('stores').document()
        doc_ref.set(store_dict)
        store_dict['id'] = doc_ref.id
        return store_dict
    except Exception as e:
        logger.error(f"Error creating store: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/stores", response_model=List[Store])
async def get_stores():
    try:
        stores_ref = db.collection('stores').order_by('createdAt', direction=firestore.Query.DESCENDING)
        stores = []
        for doc in stores_ref.stream():
            store_data = doc.to_dict()
            store_data['id'] = doc.id
            stores.append(store_data)
        return stores
    except Exception as e:
        logger.error(f"Error getting stores: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/stores/{store_id}", response_model=Store)
async def get_store(store_id: str):
    try:
        doc = db.collection('stores').document(store_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Store not found")
        store_data = doc.to_dict()
        store_data['id'] = doc.id
        return store_data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting store: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.put("/stores/{store_id}", response_model=Store)
async def update_store(store_id: str, store: Store):
    try:
        store_dict = store.model_dump(exclude={'id'})
        db.collection('stores').document(store_id).update(store_dict)
        store_dict['id'] = store_id
        return store_dict
    except Exception as e:
        logger.error(f"Error updating store: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/stores/{store_id}")
async def delete_store(store_id: str):
    try:
        db.collection('stores').document(store_id).delete()
        return {"message": "Store deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting store: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Products
@api_router.post("/products", response_model=Product)
async def create_product(product: Product):
    try:
        product_dict = product.model_dump(exclude={'id'})
        product_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('products').document()
        doc_ref.set(product_dict)
        product_dict['id'] = doc_ref.id
        return product_dict
    except Exception as e:
        logger.error(f"Error creating product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/products", response_model=List[Product])
async def get_products(storeId: Optional[str] = None):
    try:
        products_ref = db.collection('products')
        if storeId:
            products_ref = products_ref.where('storeId', '==', storeId)
        products_ref = products_ref.order_by('createdAt', direction=firestore.Query.DESCENDING)
        products = []
        for doc in products_ref.stream():
            product_data = doc.to_dict()
            product_data['id'] = doc.id
            products.append(product_data)
        return products
    except Exception as e:
        logger.error(f"Error getting products: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    try:
        db.collection('products').document(product_id).delete()
        return {"message": "Product deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting product: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# News
@api_router.post("/news", response_model=News)
async def create_news(news: News):
    try:
        news_dict = news.model_dump(exclude={'id'})
        news_dict['date'] = datetime.now(timezone.utc).isoformat()
        news_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('news').document()
        doc_ref.set(news_dict)
        news_dict['id'] = doc_ref.id
        return news_dict
    except Exception as e:
        logger.error(f"Error creating news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/news", response_model=List[News])
async def get_news():
    try:
        news_ref = db.collection('news').order_by('createdAt', direction=firestore.Query.DESCENDING)
        news_list = []
        for doc in news_ref.stream():
            news_data = doc.to_dict()
            news_data['id'] = doc.id
            news_list.append(news_data)
        return news_list
    except Exception as e:
        logger.error(f"Error getting news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/news/{news_id}")
async def delete_news(news_id: str):
    try:
        db.collection('news').document(news_id).delete()
        return {"message": "News deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting news: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Professionals
@api_router.post("/professionals", response_model=Professional)
async def create_professional(professional: Professional):
    try:
        prof_dict = professional.model_dump(exclude={'id'})
        prof_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('professionals').document()
        doc_ref.set(prof_dict)
        prof_dict['id'] = doc_ref.id
        return prof_dict
    except Exception as e:
        logger.error(f"Error creating professional: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/professionals", response_model=List[Professional])
async def get_professionals():
    try:
        prof_ref = db.collection('professionals').order_by('createdAt', direction=firestore.Query.DESCENDING)
        professionals = []
        for doc in prof_ref.stream():
            prof_data = doc.to_dict()
            prof_data['id'] = doc.id
            professionals.append(prof_data)
        return professionals
    except Exception as e:
        logger.error(f"Error getting professionals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/professionals/{prof_id}")
async def delete_professional(prof_id: str):
    try:
        db.collection('professionals').document(prof_id).delete()
        return {"message": "Professional deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting professional: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Trips
@api_router.post("/trips", response_model=Trip)
async def create_trip(trip: Trip):
    try:
        trip_dict = trip.model_dump(exclude={'id'})
        trip_dict['createdAt'] = datetime.now(timezone.utc).isoformat()
        doc_ref = db.collection('trips').document()
        doc_ref.set(trip_dict)
        trip_dict['id'] = doc_ref.id
        return trip_dict
    except Exception as e:
        logger.error(f"Error creating trip: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/trips", response_model=List[Trip])
async def get_trips():
    try:
        trips_ref = db.collection('trips').order_by('time')
        trips = []
        for doc in trips_ref.stream():
            trip_data = doc.to_dict()
            trip_data['id'] = doc.id
            trips.append(trip_data)
        return trips
    except Exception as e:
        logger.error(f"Error getting trips: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/trips/{trip_id}")
async def delete_trip(trip_id: str):
    try:
        db.collection('trips').document(trip_id).delete()
        return {"message": "Trip deleted successfully"}
    except Exception as e:
        logger.error(f"Error deleting trip: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# AI Slogan Generator (desabilitado por falta de dependência emergentintegrations)
# @api_router.post("/admin/generate-slogan")
# async def generate_slogan(request: SloganRequest):
#     return {"error": "Funcionalidade de slogan desabilitada. Dependência 'emergentintegrations' não instalada."}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "backend.server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )