# from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
# from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# import logging
# from pathlib import Path
# from pydantic import BaseModel, Field, ConfigDict, EmailStr
# from typing import List, Optional
# import uuid
# from datetime import datetime, timezone
# from passlib.context import CryptContext
# import smtplib
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart

# ROOT_DIR = Path(__file__).parent
# load_dotenv(ROOT_DIR / '.env')

# # MongoDB connection
# mongo_url = os.environ['MONGO_URL']
# client = AsyncIOMotorClient(mongo_url)
# db = client[os.environ['DB_NAME']]

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # Create the main app without a prefix
# app = FastAPI()

# # Create a router with the /api prefix
# api_router = APIRouter(prefix="/api")

# # Logger
# logger = logging.getLogger(__name__)

# # ============ MODELS ============

# class MetalRate(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     gold_22k: float
#     gold_24k: float
#     silver_999: float
#     diamond_per_carat: float
#     updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     updated_by: str = "admin"

# class MetalRateUpdate(BaseModel):
#     gold_22k: float
#     gold_24k: float
#     silver_999: float
#     diamond_per_carat: float

# class ProductImage(BaseModel):
#     url: str
#     caption: Optional[str] = None
#     is_cover: bool = False

# class Product(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     name: str
#     description: str
#     metal_type: str  # Gold, Silver, Diamond
#     purity: str  # 18K, 22K, 24K, 925, etc
#     weight: float  # in grams or carats
#     dimensions: Optional[str] = None
#     category: str  # Men, Women, Kids
#     occasion: str  # Daily Wear, Wedding, Festive, Gifting
#     images: List[ProductImage] = []
#     view_count: int = 0
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class ProductCreate(BaseModel):
#     name: str
#     description: str
#     metal_type: str
#     purity: str
#     weight: float
#     dimensions: Optional[str] = None
#     category: str
#     occasion: str
#     images: List[ProductImage] = []

# class ProductUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     metal_type: Optional[str] = None
#     purity: Optional[str] = None
#     weight: Optional[float] = None
#     dimensions: Optional[str] = None
#     category: Optional[str] = None
#     occasion: Optional[str] = None
#     images: Optional[List[ProductImage]] = None

# class Testimonial(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     customer_name: str
#     rating: int
#     review: str
#     product_type: str
#     is_approved: bool = False
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class TestimonialCreate(BaseModel):
#     customer_name: str
#     rating: int
#     review: str
#     product_type: str

# class Enquiry(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     name: str
#     email: EmailStr
#     phone: str
#     message: str
#     enquiry_type: str  # Custom Design, General, Appointment
#     created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# class EnquiryCreate(BaseModel):
#     name: str
#     email: EmailStr
#     phone: str
#     message: str
#     enquiry_type: str

# class OrganizerLogin(BaseModel):
#     email: str
#     password: str

# class OrganizerPasswordChange(BaseModel):
#     old_password: str
#     new_password: str

# class VisitorLog(BaseModel):
#     model_config = ConfigDict(extra="ignore")
#     id: str = Field(default_factory=lambda: str(uuid.uuid4()))
#     product_id: str
#     timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
#     session_id: str

# class VisitorLogCreate(BaseModel):
#     product_id: str
#     session_id: str

# # ============ UTILITY FUNCTIONS ============

# def calculate_price(metal_type: str, purity: str, weight: float, rates: dict):
#     """Calculate total price with breakdown"""
#     # Get metal rate
#     if metal_type.lower() == "gold":
#         if purity == "22K":
#             rate = rates.get("gold_22k", 0)
#         elif purity == "24K":
#             rate = rates.get("gold_24k", 0)
#         else:  # 18K
#             rate = rates.get("gold_22k", 0) * 0.75
#     elif metal_type.lower() == "silver":
#         rate = rates.get("silver_999", 0)
#     else:  # Diamond
#         rate = rates.get("diamond_per_carat", 0)
    
#     metal_value = rate * weight
#     making_charges = metal_value * 0.10  # 10% of metal value
#     gst_on_metal = metal_value * 0.03  # 3% GST on metal
#     gst_on_making = making_charges * 0.05  # 5% GST on making
#     total_price = metal_value + making_charges + gst_on_metal + gst_on_making
    
#     return {
#         "rate": rate,
#         "metal_value": round(metal_value, 2),
#         "making_charges": round(making_charges, 2),
#         "gst_on_metal": round(gst_on_metal, 2),
#         "gst_on_making": round(gst_on_making, 2),
#         "total_price": round(total_price, 2)
#     }

# async def send_email(to_email: str, subject: str, body: str):
#     """Send email notification"""
#     try:
#         # For demo purposes, just log the email
#         logger.info(f"Email to {to_email}: {subject}")
#         logger.info(f"Body: {body}")
#         # In production, implement actual SMTP email sending
#     except Exception as e:
#         logger.error(f"Error sending email: {e}")

# # ============ METAL RATES ROUTES ============

# @api_router.get("/metal-rates", response_model=MetalRate)
# async def get_metal_rates():
#     """Get current metal rates"""
#     rates = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
#     if not rates:
#         # Initialize default rates
#         default_rates = MetalRate(
#             gold_22k=6500.0,
#             gold_24k=7000.0,
#             silver_999=85.0,
#             diamond_per_carat=70000.0
#         )
#         doc = default_rates.model_dump()
#         doc['updated_at'] = doc['updated_at'].isoformat()
#         await db.metal_rates.insert_one(doc)
#         return default_rates
    
#     if isinstance(rates['updated_at'], str):
#         rates['updated_at'] = datetime.fromisoformat(rates['updated_at'])
#     return MetalRate(**rates)

# @api_router.put("/metal-rates", response_model=MetalRate)
# async def update_metal_rates(rates_update: MetalRateUpdate):
#     """Update metal rates (admin only)"""
#     new_rates = MetalRate(**rates_update.model_dump())
#     doc = new_rates.model_dump()
#     doc['updated_at'] = doc['updated_at'].isoformat()
#     await db.metal_rates.insert_one(doc)
#     return new_rates

# # ============ PRODUCT ROUTES ============

# @api_router.post("/products", response_model=Product)
# async def create_product(product: ProductCreate):
#     """Create new product"""
#     product_obj = Product(**product.model_dump())
#     doc = product_obj.model_dump()
#     doc['created_at'] = doc['created_at'].isoformat()
#     doc['updated_at'] = doc['updated_at'].isoformat()
#     await db.products.insert_one(doc)
#     return product_obj

# @api_router.get("/products", response_model=List[Product])
# async def get_products(
#     metal_type: Optional[str] = None,
#     category: Optional[str] = None,
#     occasion: Optional[str] = None,
#     purity: Optional[str] = None,
#     min_price: Optional[float] = None,
#     max_price: Optional[float] = None,
#     sort_by: Optional[str] = "new"
# ):
#     """Get all products with filters"""
#     query = {}
#     if metal_type:
#         query["metal_type"] = metal_type
#     if category:
#         query["category"] = category
#     if occasion:
#         query["occasion"] = occasion
#     if purity:
#         query["purity"] = purity
    
#     # Get rates for price calculation
#     rates_doc = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
#     rates = rates_doc if rates_doc else {
#         "gold_22k": 6500.0,
#         "gold_24k": 7000.0,
#         "silver_999": 85.0,
#         "diamond_per_carat": 70000.0
#     }
    
#     # Sorting
#     sort_options = {
#         "bestseller": [("view_count", -1)],
#         "new": [("created_at", -1)],
#         "price_low": [("weight", 1)],
#         "price_high": [("weight", -1)]
#     }
#     sort = sort_options.get(sort_by, [("created_at", -1)])
    
#     products = await db.products.find(query, {"_id": 0}).sort(sort).to_list(1000)
    
#     # Convert datetime strings
#     for product in products:
#         if isinstance(product['created_at'], str):
#             product['created_at'] = datetime.fromisoformat(product['created_at'])
#         if isinstance(product['updated_at'], str):
#             product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
#     # Filter by price range if provided
#     if min_price is not None or max_price is not None:
#         filtered_products = []
#         for product in products:
#             price_info = calculate_price(
#                 product['metal_type'],
#                 product['purity'],
#                 product['weight'],
#                 rates
#             )
#             total_price = price_info['total_price']
#             if (min_price is None or total_price >= min_price) and \
#                (max_price is None or total_price <= max_price):
#                 filtered_products.append(product)
#         products = filtered_products
    
#     return products

# @api_router.get("/products/{product_id}", response_model=Product)
# async def get_product(product_id: str):
#     """Get single product by ID"""
#     product = await db.products.find_one({"id": product_id}, {"_id": 0})
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
    
#     if isinstance(product['created_at'], str):
#         product['created_at'] = datetime.fromisoformat(product['created_at'])
#     if isinstance(product['updated_at'], str):
#         product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
#     return Product(**product)

# @api_router.put("/products/{product_id}", response_model=Product)
# async def update_product(product_id: str, product_update: ProductUpdate):
#     """Update product"""
#     update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
#     update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
#     result = await db.products.update_one(
#         {"id": product_id},
#         {"$set": update_data}
#     )
    
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Product not found")
    
#     updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
#     if isinstance(updated_product['created_at'], str):
#         updated_product['created_at'] = datetime.fromisoformat(updated_product['created_at'])
#     if isinstance(updated_product['updated_at'], str):
#         updated_product['updated_at'] = datetime.fromisoformat(updated_product['updated_at'])
    
#     return Product(**updated_product)

# @api_router.delete("/products/{product_id}")
# async def delete_product(product_id: str):
#     """Delete product"""
#     result = await db.products.delete_one({"id": product_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Product not found")
#     return {"message": "Product deleted successfully"}

# @api_router.get("/products/{product_id}/price")
# async def get_product_price(product_id: str):
#     """Get product price breakdown"""
#     product = await db.products.find_one({"id": product_id}, {"_id": 0})
#     if not product:
#         raise HTTPException(status_code=404, detail="Product not found")
    
#     rates = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
#     if not rates:
#         rates = {
#             "gold_22k": 6500.0,
#             "gold_24k": 7000.0,
#             "silver_999": 85.0,
#             "diamond_per_carat": 70000.0
#         }
    
#     price_breakdown = calculate_price(
#         product['metal_type'],
#         product['purity'],
#         product['weight'],
#         rates
#     )
    
#     return {
#         "product_id": product_id,
#         "weight": product['weight'],
#         "metal_type": product['metal_type'],
#         "purity": product['purity'],
#         **price_breakdown
#     }

# # ============ VISITOR TRACKING ============

# @api_router.post("/visitor-log")
# async def log_visitor(visitor_log: VisitorLogCreate):
#     """Log product view"""
#     log_obj = VisitorLog(**visitor_log.model_dump())
#     doc = log_obj.model_dump()
#     doc['timestamp'] = doc['timestamp'].isoformat()
#     await db.visitor_logs.insert_one(doc)
    
#     # Increment view count
#     await db.products.update_one(
#         {"id": visitor_log.product_id},
#         {"$inc": {"view_count": 1}}
#     )
    
#     return {"message": "Visitor logged"}

# @api_router.get("/bestsellers", response_model=List[Product])
# async def get_bestsellers(limit: int = 10):
#     """Get bestselling products"""
#     products = await db.products.find(
#         {},
#         {"_id": 0}
#     ).sort("view_count", -1).limit(limit).to_list(limit)
    
#     for product in products:
#         if isinstance(product['created_at'], str):
#             product['created_at'] = datetime.fromisoformat(product['created_at'])
#         if isinstance(product['updated_at'], str):
#             product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
#     return products

# # ============ TESTIMONIALS ============

# @api_router.post("/testimonials", response_model=Testimonial)
# async def create_testimonial(testimonial: TestimonialCreate):
#     """Create new testimonial"""
#     testimonial_obj = Testimonial(**testimonial.model_dump())
#     doc = testimonial_obj.model_dump()
#     doc['created_at'] = doc['created_at'].isoformat()
#     await db.testimonials.insert_one(doc)
#     return testimonial_obj

# @api_router.get("/testimonials", response_model=List[Testimonial])
# async def get_testimonials(approved_only: bool = True):
#     """Get testimonials"""
#     query = {"is_approved": True} if approved_only else {}
#     testimonials = await db.testimonials.find(query, {"_id": 0}).to_list(1000)
    
#     for testimonial in testimonials:
#         if isinstance(testimonial['created_at'], str):
#             testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    
#     return testimonials

# @api_router.put("/testimonials/{testimonial_id}/approve")
# async def approve_testimonial(testimonial_id: str):
#     """Approve testimonial"""
#     result = await db.testimonials.update_one(
#         {"id": testimonial_id},
#         {"$set": {"is_approved": True}}
#     )
#     if result.matched_count == 0:
#         raise HTTPException(status_code=404, detail="Testimonial not found")
#     return {"message": "Testimonial approved"}

# # ============ ENQUIRIES ============

# @api_router.post("/enquiries", response_model=Enquiry)
# async def create_enquiry(enquiry: EnquiryCreate):
#     """Create new enquiry"""
#     enquiry_obj = Enquiry(**enquiry.model_dump())
#     doc = enquiry_obj.model_dump()
#     doc['created_at'] = doc['created_at'].isoformat()
#     await db.enquiries.insert_one(doc)
    
#     # Send email notification
#     email_body = f"""
#     New Enquiry from DGM Gold Works Website
    
#     Name: {enquiry.name}
#     Email: {enquiry.email}
#     Phone: {enquiry.phone}
#     Type: {enquiry.enquiry_type}
#     Message: {enquiry.message}
#     """
#     await send_email("dgm.jewellerss@gmail.com", "New Website Enquiry", email_body)
    
#     return enquiry_obj

# @api_router.get("/enquiries", response_model=List[Enquiry])
# async def get_enquiries():
#     """Get all enquiries"""
#     enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
#     for enquiry in enquiries:
#         if isinstance(enquiry['created_at'], str):
#             enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
#     return enquiries

# # ============ ORGANIZER AUTH ============

# @api_router.post("/organizer/login")
# async def organizer_login(login: OrganizerLogin):
#     """Organizer login"""
#     # Check if organizer exists
#     organizer = await db.organizers.find_one({"email": login.email}, {"_id": 0})
    
#     if not organizer:
#         # Create default organizer on first login
#         if login.email == "dgm.jewellerss@gmail.com" and login.password == "23Bcs119":
#             hashed_password = pwd_context.hash("23Bcs119")
#             default_organizer = {
#                 "id": str(uuid.uuid4()),
#                 "email": "dgm.jewellerss@gmail.com",
#                 "password": hashed_password,
#                 "must_change_password": True,
#                 "created_at": datetime.now(timezone.utc).isoformat()
#             }
#             await db.organizers.insert_one(default_organizer)
#             return {
#                 "success": True,
#                 "must_change_password": True,
#                 "email": login.email
#             }
#         else:
#             raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     # Verify password
#     if not pwd_context.verify(login.password, organizer['password']):
#         raise HTTPException(status_code=401, detail="Invalid credentials")
    
#     # Log activity
#     await db.activity_logs.insert_one({
#         "id": str(uuid.uuid4()),
#         "email": login.email,
#         "action": "login",
#         "timestamp": datetime.now(timezone.utc).isoformat()
#     })
    
#     return {
#         "success": True,
#         "must_change_password": organizer.get('must_change_password', False),
#         "email": login.email
#     }

# @api_router.post("/organizer/change-password")
# async def change_password(email: str, password_change: OrganizerPasswordChange):
#     """Change organizer password"""
#     organizer = await db.organizers.find_one({"email": email}, {"_id": 0})
#     if not organizer:
#         raise HTTPException(status_code=404, detail="Organizer not found")
    
#     # Verify old password
#     if not pwd_context.verify(password_change.old_password, organizer['password']):
#         raise HTTPException(status_code=401, detail="Invalid old password")
    
#     # Update password
#     hashed_password = pwd_context.hash(password_change.new_password)
#     await db.organizers.update_one(
#         {"email": email},
#         {"$set": {"password": hashed_password, "must_change_password": False}}
#     )
    
#     return {"message": "Password changed successfully"}

# @api_router.get("/organizer/analytics")
# async def get_analytics():
#     """Get dashboard analytics"""
#     total_products = await db.products.count_documents({})
#     total_enquiries = await db.enquiries.count_documents({})
#     pending_testimonials = await db.testimonials.count_documents({"is_approved": False})
    
#     # Get bestsellers
#     bestsellers = await db.products.find(
#         {},
#         {"_id": 0, "name": 1, "view_count": 1}
#     ).sort("view_count", -1).limit(5).to_list(5)
    
#     return {
#         "total_products": total_products,
#         "total_enquiries": total_enquiries,
#         "pending_testimonials": pending_testimonials,
#         "bestsellers": bestsellers
#     }

# @api_router.get("/")
# async def root():
#     return {"message": "DGM Gold Works API"}

# # Include the router in the main app
# app.include_router(api_router)

# app.add_middleware(
#     CORSMiddleware,
#     allow_credentials=True,
#     allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )

# @app.on_event("shutdown")
# async def shutdown_db_client():
#     client.close()











from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
# from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.staticfiles import StaticFiles

import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from passlib.context import CryptContext
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests  # <-- added for URL image download

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create the main app without a prefix
app = FastAPI()
origins = [
    "https://my-jewellery.vercel.app",
]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Logger
logger = logging.getLogger(__name__)

# ============ MODELS ============

class MetalRate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    gold_22k: float
    gold_24k: float
    silver_999: float
    diamond_per_carat: float
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_by: str = "admin"

class MetalRateUpdate(BaseModel):
    gold_22k: float
    gold_24k: float
    silver_999: float
    diamond_per_carat: float

class ProductImage(BaseModel):
    url: str
    caption: Optional[str] = None
    is_cover: bool = False

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    metal_type: str  # Gold, Silver, Diamond
    purity: str  # 18K, 22K, 24K, 925, etc
    weight: float  # in grams or carats
    dimensions: Optional[str] = None
    category: str  # Men, Women, Kids
    occasion: str  # Daily Wear, Wedding, Festive, Gifting
    images: List[ProductImage] = []
    view_count: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductCreate(BaseModel):
    name: str
    description: str
    metal_type: str
    purity: str
    weight: float
    dimensions: Optional[str] = None
    category: str
    occasion: str
    images: List[ProductImage] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    metal_type: Optional[str] = None
    purity: Optional[str] = None
    weight: Optional[float] = None
    dimensions: Optional[str] = None
    category: Optional[str] = None
    occasion: Optional[str] = None
    images: Optional[List[ProductImage]] = None

class Testimonial(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    rating: int
    review: str
    product_type: str
    is_approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestimonialCreate(BaseModel):
    customer_name: str
    rating: int
    review: str
    product_type: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    message: str
    enquiry_type: str  # Custom Design, General, Appointment
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str
    enquiry_type: str

class OrganizerLogin(BaseModel):
    email: str
    password: str

class OrganizerPasswordChange(BaseModel):
    old_password: str
    new_password: str

class VisitorLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    session_id: str

class VisitorLogCreate(BaseModel):
    product_id: str
    session_id: str

class ImageUrlRequest(BaseModel):
    url: str

# ============ UTILITY FUNCTIONS ============

def calculate_price(metal_type: str, purity: str, weight: float, rates: dict):
    """Calculate total price with breakdown"""
    # Get metal rate
    if metal_type.lower() == "gold":
        if purity == "22K":
            rate = rates.get("gold_22k", 0)
        elif purity == "24K":
            rate = rates.get("gold_24k", 0)
        else:  # 18K
            rate = rates.get("gold_22k", 0) * 0.75
    elif metal_type.lower() == "silver":
        rate = rates.get("silver_999", 0)
    else:  # Diamond
        rate = rates.get("diamond_per_carat", 0)
    
    metal_value = rate * weight
    making_charges = metal_value * 0.10  # 10% of metal value
    gst_on_metal = metal_value * 0.03  # 3% GST on metal
    gst_on_making = making_charges * 0.05  # 5% GST on making
    total_price = metal_value + making_charges + gst_on_metal + gst_on_making
    
    return {
        "rate": rate,
        "metal_value": round(metal_value, 2),
        "making_charges": round(making_charges, 2),
        "gst_on_metal": round(gst_on_metal, 2),
        "gst_on_making": round(gst_on_making, 2),
        "total_price": round(total_price, 2)
    }

async def send_email(to_email: str, subject: str, body: str):
    """Send email notification"""
    try:
        # For demo purposes, just log the email
        logger.info(f"Email to {to_email}: {subject}")
        logger.info(f"Body: {body}")
        # In production, implement actual SMTP email sending
    except Exception as e:
        logger.error(f"Error sending email: {e}")

# ============ METAL RATES ROUTES ============

@api_router.get("/metal-rates", response_model=MetalRate)
async def get_metal_rates():
    """Get current metal rates"""
    rates = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
    if not rates:
        # Initialize default rates
        default_rates = MetalRate(
            gold_22k=6500.0,
            gold_24k=7000.0,
            silver_999=85.0,
            diamond_per_carat=70000.0
        )
        doc = default_rates.model_dump()
        doc['updated_at'] = doc['updated_at'].isoformat()
        await db.metal_rates.insert_one(doc)
        return default_rates
    
    if isinstance(rates['updated_at'], str):
        rates['updated_at'] = datetime.fromisoformat(rates['updated_at'])
    return MetalRate(**rates)

@api_router.put("/metal-rates", response_model=MetalRate)
async def update_metal_rates(rates_update: MetalRateUpdate):
    """Update metal rates (admin only)"""
    new_rates = MetalRate(**rates_update.model_dump())
    doc = new_rates.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.metal_rates.insert_one(doc)
    return new_rates

# ============ IMAGE UPLOAD ROUTES ============

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

@api_router.post("/upload-by-url")
async def upload_by_url(payload: ImageUrlRequest):
    """Download image from a URL and save it on the server"""
    url = payload.url.strip()

    if not (url.startswith("http://") or url.startswith("https://")):
        raise HTTPException(status_code=400, detail="Invalid URL")

    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Could not fetch image from URL")

        ext = ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        filepath = UPLOAD_DIR / filename

        with open(filepath, "wb") as f:
            f.write(resp.content)

        return {
            "status": "ok",
            "source": "url",
            "filename": filename,
        }
    except Exception as e:
        logger.error(f"Error downloading image: {e}")
        raise HTTPException(status_code=500, detail="Error downloading image")

@api_router.post("/upload-by-file")
async def upload_by_file(file: UploadFile = File(...)):
    """Upload image file (e.g., from gallery) and save it on the server"""
    try:
        contents = await file.read()

        original_ext = Path(file.filename).suffix or ".jpg"
        filename = f"{uuid.uuid4().hex}{original_ext}"
        filepath = UPLOAD_DIR / filename

        with open(filepath, "wb") as f:
            f.write(contents)

        return {
            "status": "ok",
            "source": "file",
            "filename": filename,
        }
    except Exception as e:
        logger.error(f"Error saving uploaded file: {e}")
        raise HTTPException(status_code=500, detail="Error saving uploaded file")

# ============ PRODUCT ROUTES ============

@api_router.post("/products", response_model=Product)
async def create_product(product: ProductCreate):
    """Create new product"""
    product_obj = Product(**product.model_dump())
    doc = product_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    await db.products.insert_one(doc)
    return product_obj

@api_router.get("/products", response_model=List[Product])
async def get_products(
    metal_type: Optional[str] = None,
    category: Optional[str] = None,
    occasion: Optional[str] = None,
    purity: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "new"
):
    """Get all products with filters"""
    query = {}
    if metal_type:
        query["metal_type"] = metal_type
    if category:
        query["category"] = category
    if occasion:
        query["occasion"] = occasion
    if purity:
        query["purity"] = purity
    
    # Get rates for price calculation
    rates_doc = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
    rates = rates_doc if rates_doc else {
        "gold_22k": 6500.0,
        "gold_24k": 7000.0,
        "silver_999": 85.0,
        "diamond_per_carat": 70000.0
    }
    
    # Sorting
    sort_options = {
        "bestseller": [("view_count", -1)],
        "new": [("created_at", -1)],
        "price_low": [("weight", 1)],
        "price_high": [("weight", -1)]
    }
    sort = sort_options.get(sort_by, [("created_at", -1)])
    
    products = await db.products.find(query, {"_id": 0}).sort(sort).to_list(1000)
    
    # Convert datetime strings
    for product in products:
        if isinstance(product['created_at'], str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
        if isinstance(product['updated_at'], str):
            product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    # Filter by price range if provided
    if min_price is not None or max_price is not None:
        filtered_products = []
        for product in products:
            price_info = calculate_price(
                product['metal_type'],
                product['purity'],
                product['weight'],
                rates
            )
            total_price = price_info['total_price']
            if (min_price is None or total_price >= min_price) and \
               (max_price is None or total_price <= max_price):
                filtered_products.append(product)
        products = filtered_products
    
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    """Get single product by ID"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if isinstance(product['created_at'], str):
        product['created_at'] = datetime.fromisoformat(product['created_at'])
    if isinstance(product['updated_at'], str):
        product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    return Product(**product)

@api_router.put("/products/{product_id}", response_model=Product)
async def update_product(product_id: str, product_update: ProductUpdate):
    """Update product"""
    update_data = {k: v for k, v in product_update.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.products.update_one(
        {"id": product_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    updated_product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if isinstance(updated_product['created_at'], str):
        updated_product['created_at'] = datetime.fromisoformat(updated_product['created_at'])
    if isinstance(updated_product['updated_at'], str):
        updated_product['updated_at'] = datetime.fromisoformat(updated_product['updated_at'])
    
    return Product(**updated_product)

@api_router.delete("/products/{product_id}")
async def delete_product(product_id: str):
    """Delete product"""
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted successfully"}

@api_router.get("/products/{product_id}/price")
async def get_product_price(product_id: str):
    """Get product price breakdown"""
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    rates = await db.metal_rates.find_one({}, {"_id": 0}, sort=[("updated_at", -1)])
    if not rates:
        rates = {
            "gold_22k": 6500.0,
            "gold_24k": 7000.0,
            "silver_999": 85.0,
            "diamond_per_carat": 70000.0
        }
    
    price_breakdown = calculate_price(
        product['metal_type'],
        product['purity'],
        product['weight'],
        rates
    )
    
    return {
        "product_id": product_id,
        "weight": product['weight'],
        "metal_type": product['metal_type'],
        "purity": product['purity'],
        **price_breakdown
    }

# ============ VISITOR TRACKING ============

@api_router.post("/visitor-log")
async def log_visitor(visitor_log: VisitorLogCreate):
    """Log product view"""
    log_obj = VisitorLog(**visitor_log.model_dump())
    doc = log_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    await db.visitor_logs.insert_one(doc)
    
    # Increment view count
    await db.products.update_one(
        {"id": visitor_log.product_id},
        {"$inc": {"view_count": 1}}
    )
    
    return {"message": "Visitor logged"}

@api_router.get("/bestsellers", response_model=List[Product])
async def get_bestsellers(limit: int = 10):
    """Get bestselling products"""
    products = await db.products.find(
        {},
        {"_id": 0}
    ).sort("view_count", -1).limit(limit).to_list(limit)
    
    for product in products:
        if isinstance(product['created_at'], str):
            product['created_at'] = datetime.fromisoformat(product['created_at'])
        if isinstance(product['updated_at'], str):
            product['updated_at'] = datetime.fromisoformat(product['updated_at'])
    
    return products

# ============ TESTIMONIALS ============

@api_router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate):
    """Create new testimonial"""
    testimonial_obj = Testimonial(**testimonial.model_dump())
    doc = testimonial_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.testimonials.insert_one(doc)
    return testimonial_obj

@api_router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials(approved_only: bool = True):
    """Get testimonials"""
    query = {"is_approved": True} if approved_only else {}
    testimonials = await db.testimonials.find(query, {"_id": 0}).to_list(1000)
    
    for testimonial in testimonials:
        if isinstance(testimonial['created_at'], str):
            testimonial['created_at'] = datetime.fromisoformat(testimonial['created_at'])
    
    return testimonials

@api_router.put("/testimonials/{testimonial_id}/approve")
async def approve_testimonial(testimonial_id: str):
    """Approve testimonial"""
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": {"is_approved": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial approved"}

# ============ ENQUIRIES ============

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(enquiry: EnquiryCreate):
    """Create new enquiry"""
    enquiry_obj = Enquiry(**enquiry.model_dump())
    doc = enquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.enquiries.insert_one(doc)
    
    # Send email notification
    email_body = f"""
    New Enquiry from DGM Gold Works Website
    
    Name: {enquiry.name}
    Email: {enquiry.email}
    Phone: {enquiry.phone}
    Type: {enquiry.enquiry_type}
    Message: {enquiry.message}
    """
    await send_email("dgm.jewellerss@gmail.com", "New Website Enquiry", email_body)
    
    return enquiry_obj

@api_router.get("/enquiries", response_model=List[Enquiry])
async def get_enquiries():
    """Get all enquiries"""
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for enquiry in enquiries:
        if isinstance(enquiry['created_at'], str):
            enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
    return enquiries

# ============ ORGANIZER AUTH ============

@api_router.post("/organizer/login")
async def organizer_login(login: OrganizerLogin):
    """Organizer login"""
    # Check if organizer exists
    organizer = await db.organizers.find_one({"email": login.email}, {"_id": 0})
    
    if not organizer:
        # Create default organizer on first login
        if login.email == "dgm.jewellerss@gmail.com" and login.password == "23Bcs119":
            hashed_password = pwd_context.hash("23Bcs119")
            default_organizer = {
                "id": str(uuid.uuid4()),
                "email": "dgm.jewellerss@gmail.com",
                "password": hashed_password,
                "must_change_password": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.organizers.insert_one(default_organizer)
            return {
                "success": True,
                "must_change_password": True,
                "email": login.email
            }
        else:
            raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password
    if not pwd_context.verify(login.password, organizer['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Log activity
    await db.activity_logs.insert_one({
        "id": str(uuid.uuid4()),
        "email": login.email,
        "action": "login",
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "success": True,
        "must_change_password": organizer.get('must_change_password', False),
        "email": login.email
    }

@api_router.post("/organizer/change-password")
async def change_password(email: str, password_change: OrganizerPasswordChange):
    """Change organizer password"""
    organizer = await db.organizers.find_one({"email": email}, {"_id": 0})
    if not organizer:
        raise HTTPException(status_code=404, detail="Organizer not found")
    
    # Verify old password
    if not pwd_context.verify(password_change.old_password, organizer['password']):
        raise HTTPException(status_code=401, detail="Invalid old password")
    
    # Update password
    hashed_password = pwd_context.hash(password_change.new_password)
    await db.organizers.update_one(
        {"email": email},
        {"$set": {"password": hashed_password, "must_change_password": False}}
    )
    
    return {"message": "Password changed successfully"}

@api_router.get("/organizer/analytics")
async def get_analytics():
    """Get dashboard analytics"""
    total_products = await db.products.count_documents({})
    total_enquiries = await db.enquiries.count_documents({})
    pending_testimonials = await db.testimonials.count_documents({"is_approved": False})
    
    # Get bestsellers
    bestsellers = await db.products.find(
        {},
        {"_id": 0, "name": 1, "view_count": 1}
    ).sort("view_count", -1).limit(5).to_list(5)
    
    return {
        "total_products": total_products,
        "total_enquiries": total_enquiries,
        "pending_testimonials": pending_testimonials,
        "bestsellers": bestsellers
    }

@api_router.get("/")
async def root():
    return {"message": "DGM Gold Works API"}

# Include the router in the main app
app.include_router(api_router)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://my-jewellery.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
