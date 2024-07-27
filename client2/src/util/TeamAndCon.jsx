import { useEffect,useState } from "react";
import Header from "../app/exam/pages/components/ExamHeader";
import { Stack } from "@mui/material";
import useWindowDimensions from "./useWindowDimensions";
export default function Team() {
    const {width} = useWindowDimensions()
    const [user, setuser] = useState("");
    useEffect(() => {
        fetch("/api/user/getUserDetails")
        .then((res) => res.json())
        .then((data) => {
          if(data.status !== 'is not valid') setuser(data)});
    },[])

  const style = {
    heading: {
      FontWight: 700,
      fontSize: "21px",
    },
    h1: {
      FontWight: 700,
      fontSize: "18px",
    },
    p: {
      FontWight: 400,
      fontSize: "14px",
    },
    div: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
  };
  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <Stack
        width={ width > 652 ? "80%" : '100%'}
        direction="column"
        justifyContent="center"
        alignItems="center"
        padding="20px"
      >
        <Header user={user} />
        <Stack gap="10px" marginTop="20px">
          <h1 style={style.heading}>Privacy Policy</h1>

          <div style={style.div}>
            <h2 style={style.h1}>1. Introduction1. Introduction</h2>
            <p style={style.p}>
              "The Masters Academy" ("we," "us," or "our") is committed to
              protecting your privacy. This Privacy Policy outlines the types of
              information we collect, how we use it, and the measures we take to
              safeguard your data. By using our web app, you consent to the
              practices described in this policy.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>2. Information We Collect</h1>

            <p style={style.p}>
              We may collect the following personal information from users when
              they create an account or use our services:
            </p>
            <h1 style={style.h1}>2.1 Personal Information</h1>

            <p style={style.p}>
              Full name Email address Phone number Date of birth Address Payment
              information
            </p>
            <p style={style.p}>
              2.2 Non-Personal Information We may also collect non-personal
              information, including: Device information IP address Usage data
              Cookies and similar technologies
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>3. How We Use Information</h1>
            <p style={style.p}>
              We use the collected information for the following purposes:
            </p>
            <p style={style.p}>
              To provide our services, including scheduling tests, tracking
              progress, and managing user accounts. To personalize the user
              experience. To send important notifications and updates. To
              improve our services and develop new features. To conduct research
              and analysis. To ensure compliance with our terms and conditions.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>4. Data Sharing</h1>

            <p style={style.p}>
              We may share personal information with third parties under the
              following circumstances:
            </p>
            <p style={style.p}>
              With service providers for purposes such as hosting, payment
              processing, and customer support. In response to legal requests or
              to comply with applicable laws and regulations. To protect our
              rights, privacy, safety, or property. In connection with a merger,
              acquisition, or sale of all or a portion of our assets.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>5. Security</h1>
            <p style={style.p}>
              We take appropriate measures to protect the security and
              confidentiality of user information, but no system is completely
              secure, and we cannot guarantee the security of user data.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>6. User Choices</h1>
            <p style={style.p}>
              Users can review, update, or delete their personal information at
              any time by accessing their account settings. Users can also opt
              out of promotional communications.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>7. Cookies and Tracking Technologies</h1>
            <p style={style.p}>
              We use cookies and similar technologies to enhance the user
              experience. Users can manage cookie preferences through their
              browser settings.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>8. Changes to the Privacy Policy</h1>
            <p style={style.p}>
              We reserve the right to update our privacy policy, and users will
              be notified of any significant changes.
            </p>
          </div>
          <hr />

          <h1 style={style.heading}>Terms and Conditions</h1>
          <div style={style.div}>
            <h1 style={style.h1}>1. Acceptance of Terms</h1>
            <p style={style.p}>
              By using our web app, users agree to comply with these terms and
              conditions.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>2. User Accounts</h1>
            <p style={style.p}>
              Users are responsible for maintaining the confidentiality of their
              account information and are liable for all activities associated
              with their account.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>3. Service Usage</h1>
            <p style={style.p}>Users agree not to:</p>
            <p style={style.p}>
              Use the service for any unlawful or unauthorized purpose.
            </p>

            <p style={style.p}>
              Attempt to gain unauthorized access to our systems.
            </p>

            <p style={style.p}>
              Interfere with or disrupt the service or the servers and networks
              connected to it.
            </p>

            <p style={style.p}>
              Use the service to transmit viruses or other malicious code.
            </p>
          </div>


          <div style={style.div}>
            <h1 style={style.h1}>4. Payment and Fees</h1>
            <p style={style.p}>
              Fees for our services are as specified on our website. Users are
              responsible for payment, and all fees are non-refundable.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>5. Termination</h1>
            <p style={style.p}>
              We reserve the right to terminate or suspend user accounts at our
              discretion, especially in cases of violations of these terms and
              conditions.
            </p>
          </div>

          <div style={style.div}>
            <h1 style={style.h1}>6. Changes to Terms and Conditions</h1>
            <p style={style.p}>
              We may update these terms and conditions, and users will be
              notified of any significant changes.
            </p>
            <p style={style.p}>
              Please remember to consult with a legal professional to ensure the
              compliance of your privacy policy and terms and conditions with
              the relevant laws and regulations.
            </p>
          </div>
<hr />
  <div style={style.div}>
    <h1 style={style.h1}>
    Refund Policy For Online Subscriptions
    </h1>
    <p style={style.p}>
     once you have subscribed, you cannot change or cancel your subscription plan. Once you subscribe and make the required payment for any online subscriptions, it shall be final and there cannot be any changes or modifications to the same and neither will there be any refund.
     We will refund if there is any transaction issue.
    </p>
</div>

        </Stack>
      </Stack>
    </Stack>
  );
}
