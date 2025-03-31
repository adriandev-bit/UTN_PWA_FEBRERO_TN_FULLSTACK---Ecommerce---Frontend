import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProductArea from "./ProductArea";
import "./css/HomeScreen.css";

const HomeScreen = () => {
  const [categoryId, setCategoryId] = useState(null);  
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="home-screen">
     
      <div className="content">
       
        <Sidebar setCategoryId={setCategoryId} />
        
        <ProductArea categoryId={categoryId} />
      </div>
    </div>
  );
};

export default HomeScreen;
