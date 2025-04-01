import doctorImage from '@/assets/images/doctorImage.png'
import { Headline, Subheadline } from '@telegram-apps/telegram-ui';
import { useNavigate } from 'react-router-dom';
const DoctorsList=()=>{
     const navigate = useNavigate();
    
    return(
        <div style={{width: '95%', maxWidth: "1200px", margin: 'auto'}}>
        <div  
         style={{
            display: "flex",
            justifyContent: "space-between",
            color: "white",
            fontSize: "24px",
            marginBottom: "20px",
                }}>
            <Headline>All Doctors</Headline>
            <Subheadline>See All</Subheadline>
        </div>
        <div className="cards"
            style={{display: "flex",
                gap: "20px",
                flexWrap: "wrap"}}
            >
            <div className="card" 
                  style={{
                  backgroundColor: "#3e5f73",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  width: "350px",
                  color: "white",
                  position: "relative"}}
            >
                <img src={doctorImage}
                    style={{ width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "15px"}}
                alt="Doctor"/>
                <div className="card-content" style={{flex: '1'}}>
                    <div className="doctor-name" onClick={()=>navigate('/consultation')} style={{
                                                        fontSize: '20px',
                                                        fontWeight: "bold",
                                                        marginBottom: '5px',}}>
                                                          
                                                            Dr. kASU
                                                        </div>
                    <div className="description" style={{
                                            fontSize: "14px",
                                            opacity: "0.8",
                                            marginBottom: "10px"
                    }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    <button 
                    onClick={()=>{
                        navigate('/book');
                    }}
                    className="book-btn" style={{
                         backgroundColor: "#00a6ff",
                         color: "white",
                         padding: "8px 15px",
                         borderRadius: "20px",
                         border: "none",
                         cursor: "pointer",
                    }}>Book</button>
                </div>
                <div className="favorite" style={{
                     position: "absolute",
                     top: "10px",
                     right: "15px",
                     fontSize: "20px",
                     cursor: "pointer",
                     color: "#00a6ff",
                }}>&#9825;</div>
                <div className="rating" style={{
                     display: "flex",
                     alignItems: "center",
                     fontSize: "16px",
                     fontWeight: "bold",
                     position: "absolute",
                     bottom: "10px",
                     right: "15px"
                }}>
                    <span className="star" style={{ color: "gold",
            fontSize: "18px",
            marginRight: "5px"}}>&#9733;</span> 5.0
                </div>
            </div>
            <div className="card" 
                  style={{
                  backgroundColor: "#3e5f73",
                  borderRadius: "10px",
                  padding: "20px",
                  display: "flex",
                  alignItems: "center",
                  width: "350px",
                  color: "white",
                  position: "relative"}}
            >
                <img src={doctorImage}
                    style={{ width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "15px"}}
                alt="Doctor"/>
                <div className="card-content" style={{flex: '1'}}>
                    <div className="doctor-name" style={{
                                                        fontSize: '20px',
                                                        fontWeight: "bold",
                                                        marginBottom: '5px',}}>
                                                            Dr. Pawan
                                                        </div>
                    <div className="description" style={{
                                            fontSize: "14px",
                                            opacity: "0.8",
                                            marginBottom: "10px"
                    }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
                    <button className="book-btn" style={{
                         backgroundColor: "#00a6ff",
                         color: "white",
                         padding: "8px 15px",
                         borderRadius: "20px",
                         border: "none",
                         cursor: "pointer",
                    }}>Book</button>
                </div>
                <div className="favorite" style={{
                     position: "absolute",
                     top: "10px",
                     right: "15px",
                     fontSize: "20px",
                     cursor: "pointer",
                     color: "#00a6ff",
                }}>&#9825;</div>
                <div className="rating" style={{
                     display: "flex",
                     alignItems: "center",
                     fontSize: "16px",
                     fontWeight: "bold",
                     position: "absolute",
                     bottom: "10px",
                     right: "15px"
                }}>
                    <span className="star" style={{ color: "gold",
            fontSize: "18px",
            marginRight: "5px"}}>&#9733;</span> 5.0
                </div>
            </div>
           
        </div>
    </div>
    )
}

export default DoctorsList;