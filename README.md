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

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/c91b06c0-338a-4eba-9bda-c2697de60131" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fe232789-e90d-451c-bbb4-f8a51d58264d" />
<img width="1920" height="1013" alt="image" src="https://github.com/user-attachments/assets/40ffdd20-b3b9-42dd-b77d-cd1f9b43be21" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7e9a24e2-35d1-444e-ba69-d39a1af59de3" />







