import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProductArea from "./ProductArea";
import "./css/HomeScreen.css";

const HomeScreen = () => {
  const [categoryId, setCategoryId] = useState(null);  
  


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
