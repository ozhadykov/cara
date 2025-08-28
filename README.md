# CARA - Caretaker Assignment & Resource Allocation

🎯 **Intelligent optimization system for assigning caretakers to children based on qualifications, travel time, and workload balance.**

CARA is a comprehensive web application designed to optimize the assignment of caretakers (assistants) to children requiring care. The system uses linear programming optimization to create the most efficient assignments while considering multiple weighted criteria.

## 🌟 Key Features

- **Multi-criteria Optimization**: Considers travel time, qualifications, and workload balance
- **Three Qualification Levels**: ReKo (Basic), QHK (Qualified Helper), FK (Specialist)
- **Smart Address Management**: Address validation and reuse to minimize Google API calls
- **Flexible Assignment**: Manual and automatic pairing with intelligent load distribution
- **Real-time Travel Time Calculation**: Integration with Google Distance Matrix API
- **Batch Processing**: Efficient CSV import for bulk data management
- **Interactive Web Interface**: User-friendly React-based frontend

## 🏗️ Architecture

CARA follows a containerized microservices architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │  Optimization   │
│   (React)       │◄──►│   (FastAPI)      │◄──►│    (AMPL)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                       ┌──────▼──────┐
                       │  Database   │
                       │ (MySQL)│
                       └─────────────┘
```

### Components

- **Frontend**: React with TypeScript, DaisyUI, and Tailwind CSS
- **Backend**: Python FastAPI with business logic and API endpoints
- **Optimization Module**: AMPL-based linear programming solver
- **Database**: PostgreSQL for data persistence
- **Admin Interface**: Adminer for database management

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed on your system
- [Install Docker](https://docs.docker.com/get-started/get-docker/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ozhadykov/cara.git
   cd cara
   ```

2. **Start the application**
   ```bash
   docker compose up --build -d
   ```

3. **Verify all containers are running**
   ```bash
   docker ps
   ```

4. **Access the application**
   - Main Application: `http://localhost`
   - Database Admin: `http://localhost:8081`

## 🔑 Google API Setup (Required)

Before importing new children or caretakers, you need a valid Google API key with these services enabled:

### Required APIs
- **Distance Matrix API** - For travel time calculations
- **Address Validation API** - For address verification

### Free Tier Limits
- Address Validation: 5,000 calls/month
- Distance Matrix: 5,000 calls/month (up to 100 destinations per call)

⚠️ **Important**: Without a valid API key, you cannot import new data into the system.

### Configuration
Add your Google API key in the application settings after startup.

## 📊 Data Import

### CSV Format for Children
```csv
first_name,family_name,required_qualification,street,street_number,city,zip_code,requested_hours
Lena,Meyer,2,Lessingstraße,10,"Halle (Saale)",06114,20
Paul,Schmidt,1,Goethestraße,5,"Halle (Saale)",06110,25
Sophie,Weber,3,Hallorenring,1,"Halle (Saale)",06108,15
```

### CSV Format for Caretakers
```csv
first_name,family_name,qualification,has_car,street,street_number,city,zip_code,min_capacity,max_capacity
Sophie,Schneider,2,0,Lessingstraße,15,"Halle (Saale)",06114,25,35
Michael,Weber,1,1,Goethestraße,8,"Halle (Saale)",06110,15,25
Laura,Fischer,3,0,Hallorenring,3,"Halle (Saale)",06108,35,40
```

**Note**: Use quotes for decimal numbers (e.g., "25.56") and dots instead of commas for float values.

## 🎯 Optimization Model

CARA uses advanced linear programming to find optimal assignments:

### Optimization Criteria
1. **Qualification Matching**
   - Perfect match: 100 points
   - One level overqualified: 66.6 points
   - Two levels overqualified: 33.3 points
   - Underqualified: Excluded

2. **Travel Time Optimization**
   - Normalized score (0-1)
   - Short distances (≤15 min): Score 1.0
   - Long distances (≥90 min): Score 0.0

3. **Workload Balance**
   - Minimizes overtime penalties
   - Reduces underutilization
   - Ensures fair distribution

### Smart Features
- **Automatic Load Splitting**: High-demand children (>20 hours) can be assigned multiple caretakers
- **Existing Assignment Preservation**: Maintains manually created pairs
- **Configurable Weights**: Adjustable importance for different criteria

## 🛠️ Usage Scenarios

### What Requires Google API:
✅ Importing new children  
✅ Importing new caretakers  
✅ Adding/editing records with new addresses  

### What Works Without Google API:
✅ Pairs Manager (always functional)  
✅ Linear programming optimization  
✅ Viewing existing data  
✅ Creating assignments from existing records  

## 🔧 Development

### Project Structure
```
/cara
├── /frontend/app          # React frontend
├── /backend/app           # FastAPI backend
├── /backend/ampl_app      # AMPL optimization module
├── /database              # Database configuration
└── docker-compose.yml     # Container orchestration
```

### Making Changes

**Frontend updates:**
```bash
# Make changes in /frontend
docker compose up --build -d
```

**Backend updates:**
```bash
# Make changes in /backend/app
docker compose up --build -d
```

### API Documentation
Full API documentation is available in the application under Settings → API Overview.

## 🔒 Security

- **Reverse Proxy**: NGINX protects internal services
- **Container Isolation**: Backend and optimization modules are not externally accessible
- **Network Segmentation**: All services communicate through internal Docker network

## 💾 Backup & Maintenance

### Database Backup
```bash
docker exec -t database mysqldump -u root -p phenix_mysql > backup.sql
```

### Database Restore
```bash
docker exec -i database mysql -u root -p phenix_mysql < backup.sql
```

### Stop Application
```bash
docker compose down -v
```

### Restart Application
```bash
docker compose up --build -d
```

## 🐛 Troubleshooting

**Containers won't start:**
- Check if Docker is running
- Verify ports 80, 3306, 8081 are available

**Database connection issues:**
- Ensure database container is running: `docker ps`
- Check logs: `docker logs database`

**Optimization failures:**
- Check AMPL container logs: `docker logs ampl`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review the API documentation in the application

---

**Built with** ❤️ **for optimizing caretaker assignments and improving care coordination efficiency.**