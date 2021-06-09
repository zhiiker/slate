import * as React from "react";
import * as System from "~/components/system";
import * as Validations from "~/common/validations";

import Field from "~/components/core/Field";

import { AnimateSharedLayout, motion } from "framer-motion";
import { css } from "@emotion/react";
import { useForm } from "~/common/hooks";

import { SignUpPopover, Verification, AuthCheckBox } from "~/components/core/Auth/components";

const STYLES_SMALL = (theme) => css`
  font-size: ${theme.typescale.lvlN1};
  text-align: center;
  color: ${theme.system.textGrayDark};
  max-width: 228px;
  margin: 0 auto;
`;

const useTwitterSignup = () => {
  const [scene, setScene] = React.useState("accountCreation");
  const handlers = React.useMemo(() => ({ goToVerification: () => setScene("verification") }), []);
  return { ...handlers, scene };
};

const handleValidation = ({ username, email, acceptTerms }, errors) => {
  if (!Validations.username(username)) errors.username = "Invalid username";
  // Note(amine): username should not be an email
  if (Validations.email(username)) errors.username = "Username shouldn't be an email";

  if (!Validations.email(email)) errors.email = "Invalid email";

  if (!acceptTerms) errors.acceptTerms = "Must accept terms and conditions";

  return errors;
};

const MotionLayout = ({ children, ...props }) => (
  <motion.div layout {...props}>
    {children}
  </motion.div>
);

export default function TwitterSignup({
  initialEmail,
  onSignup,
  createVerification,
  onSignupWithVerification,
}) {
  const { scene, goToVerification } = useTwitterSignup();
  const {
    getFieldProps,
    getFormProps,
    values: { email, username },
    isSubmitting,
  } = useForm({
    initialValues: { username: "", email: initialEmail, acceptTerms: false },
    validate: handleValidation,
    onSubmit: async ({ username, email }) => {
      if (email !== initialEmail) {
        const response = await createVerification({ email });
        if (!response) return;
        goToVerification();
        return;
      }
      await onSignup({ email, username });
    },
  });

  if (scene === "verification") {
    const handleVerification = async ({ pin }) => {
      await onSignupWithVerification({ username, pin });
    };
    return <Verification onVerify={handleVerification} />;
  }

  return (
    <SignUpPopover title="Create an account">
      <form {...getFormProps()}>
        <Field
          autoFocus
          containerStyle={{ marginTop: 41 }}
          placeholder="Username"
          type="username"
          {...getFieldProps("username")}
          style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
        />
        <AnimateSharedLayout>
          <Field
            containerStyle={{ marginTop: 16 }}
            containerAs={MotionLayout}
            errorAs={MotionLayout}
            placeholder="Email"
            type="email"
            {...getFieldProps("email")}
            style={{ backgroundColor: "rgba(242,242,247,0.5)" }}
          />

          <motion.div layout>
            <AuthCheckBox style={{ marginTop: 16 }} {...getFieldProps("acceptTerms")} />
            <System.ButtonPrimary
              full
              style={{ marginTop: 36 }}
              loading={isSubmitting}
              type="submit"
            >
              Create account
            </System.ButtonPrimary>
          </motion.div>
          {(!initialEmail || initialEmail !== email) && (
            <motion.div layout>
              <System.P css={STYLES_SMALL} style={{ marginTop: 16 }}>
                You will receive a code to verify your email at this address
              </System.P>
            </motion.div>
          )}
        </AnimateSharedLayout>
      </form>
    </SignUpPopover>
  );
}
