
import {
  Input,
  
  Select,
  Button,
 
  Text,
  Title,
  Section,
} from "@telegram-apps/telegram-ui";
import { Page } from "@/components/Page";

const SignUpPage = () => {
  return (
    <Page back={true}>
      <Section>
        <Title>Create New Account</Title>
        <Text>Full Name</Text>
        <Input placeholder="Enter Your Full Name" />
        <Text>Password</Text>
        <Input type="password" placeholder="Enter Your Password" />
        <Text>Email</Text>
        <Input placeholder="Enter Your Email" />
        <Text>Mobile Number</Text>
        <Input placeholder="Enter Your Phone Number" />
        <Text>City</Text>
        <Select header="Select">
        <option>Addis Ababa</option>
        <option>Adama</option>
        <option>Mekelle</option>
        <option>Hawassa</option>
          </Select>
        <Text>Child Status</Text>
        {/* <Select placeholder="Enter Child Status" /> */}
        <Select header="Select">
        <option>Pregnant</option>
        <option>One month </option>
        <option>One year </option>
        <option>two year </option>
      </Select>
        <Text>Child Name</Text>
        <Input placeholder="Enter Child Name" />
        <Text>Child Gender</Text>
        {/* <Select placeholder="Enter Child Gender" /> */}
        <Select header="Select">
        <option>Male</option>
        <option>Female</option>
      </Select>
        <Text>Child Date Of Birth</Text>
        <Input placeholder="Enter Child Date Of Birth" />
        <Text>Child Weight</Text>
        <Input placeholder="Enter Child Weight" />
        <Text>Child Height</Text>
        <Input placeholder="Enter Child Height" />
        <Button stretched>Sign Up</Button>
      </Section>
    </Page>
  );
};

export default SignUpPage;