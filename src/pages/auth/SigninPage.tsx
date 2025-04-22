// SignInPage.tsx
import {
    Button,
  
  
    Headline,
    Input,
    Section,
    Subheadline,
    Text,
  } from "@telegram-apps/telegram-ui";
  import { useState } from "react";
  import "./sign-in-page.css";
import { Page } from "@/components/Page";
  
  export const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    return (    
        <Page back={true}>
 
        <Section style={{padding: '20px', background: 'inherit', height: '100vh', borderRadius: '10px'}} className="signin-container">
        <Headline className="signin-title" style={{margin: '50px 20px'}}> Sign In</Headline>
            
        <Section >
        
              <Subheadline>Email</Subheadline>  
              <Input
             
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            
    
  
            <Subheadline>Password</Subheadline>  
              <Input
              
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
           
          
  
          <Text className="forgot-password">
            Forget Password
          </Text>
  
          <Button
            size="l"
            stretched
            className="signin-button"
            style={{marginTop: '100px'}}
          >
            Sign In
          </Button>
        </Section>
        </Section>
      </Page>
    );
  };

  export default SignInPage;