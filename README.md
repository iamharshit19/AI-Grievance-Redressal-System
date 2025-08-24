#Overview

This project presents an AI-driven Indian Grievance Management System that simplifies the lodging and resolution of public complaints. By integrating a multilingual chatbot, the system ensures accessibility across diverse linguistic groups.
It employs advanced AI for automatic complaint categorization, sentiment analysis, and prioritization. Real-time tracking and offer transparency and trust. The platform bridges the gap between citizens and authorities, fostering efficient communication and prompt redressal of grievances.


#Frontend

    • React
    • TailwindCSS
#Backend

    • Express.js
    • Node.js
    • Flask
    • MongoDB
#ML

    • NLTK
    • Tensorflow
    • Numpy
      
#Project Structure
  
    /
    ├── frontend/            # React-based interfaces
    │   ├── grievancesystem/     # Citizen-facing portal
    │   └── officials-portal/    # Admin dashboard
    ├── backend/             # Node.js + Express + MongoDB APIs Python Flask AI/ML microservices
    └── README.md


#Features
1.Citizen Portal
    
    • Easy grievance submission
      
    • Tracking via unique ID
      
    • Responsive design
      
    • View admin announcements
      
    • Priority-based grievance handling (AI-powered)
2.Officials Portal
   
    • Department-wise dashboard
      
    • Status management (Pending, Processing, Resolved, Rejected)
      
    • Grievance statistics with charts
      
    • Admin announcement module
3.AI/ML Capabilities
    
    • Priority prediction based on text (High / Medium / Low)
      
    • Built using NLTK and TensorFlow
      
    • Flask API for classification
      
    • NLP pipeline using Naive Bayes and neural models


# Database Collections (MongoDB)
grievances: Stores all grievance data

admins: Admin login and announcements

announcements: Stores official notices

#How to run

1. Backend (Node.js + MongoDB)

       cd backend
       npm install
       node server.js
2. Frontend(React)

       cd frontend
i)Citizen portal
        
    cd citizen-portal
    npm install
    npm run dev
ii) Admin Portal
    
    cd admin-portal
    cd login-signup
    npm install
    npm run dev
4. Flask server for AI chatbot and classfication

       cd backend
       cd neural-network-chatbot
       python chatbot.py


//for classifier
          
          python classifier.py



#Acknowledgements
>NLTK for natural language preprocessing

>TensorFlow for training AI models

>React & Tailwind for modern UI

>MongoDB for fast and scalable storage


![Screenshot from 2025-06-08 16-33-41](https://github.com/user-attachments/assets/a3fa86ce-60ad-41c8-ad53-5ecf74ca34a3)

![Screenshot from 2025-06-08 16-33-46](https://github.com/user-attachments/assets/7cb21931-4574-4230-b11c-d8900ea72267)

![Screenshot from 2025-06-08 16-33-55](https://github.com/user-attachments/assets/180d18ed-3844-4800-b0a1-2d39b93ac02f)

![Screenshot from 2025-06-08 16-34-04](https://github.com/user-attachments/assets/7785a16c-dc0d-4145-ab33-176166b992d9)

![Screenshot from 2025-06-08 16-34-09](https://github.com/user-attachments/assets/d1e0cd45-69fe-4778-8432-1f93eb4bf695)

![Screenshot from 2025-06-08 16-34-13](https://github.com/user-attachments/assets/61b27cf2-c607-4acf-9d56-3176364d439a)

![Screenshot from 2025-06-08 16-34-18](https://github.com/user-attachments/assets/2bfce3f8-ec1f-4967-b580-92d198281288)




