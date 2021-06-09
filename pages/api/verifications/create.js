import * as Data from "~/node_common/data";
import * as Validations from "~/common/validations";
import * as Strings from "~/common/strings";
import * as Environment from "~/node_common/environment";
import * as Utilities from "~/node_common/utilities";
import * as EmailManager from "~/node_common/managers/emails";

// NOTE(amine): this endpoint is rate limited in ./server.js,
export default async (req, res) => {
  if (!Strings.isEmpty(Environment.ALLOWED_HOST) && req.headers.host !== Environment.ALLOWED_HOST) {
    return res
      .status(403)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_NOT_ALLOWED", error: true });
  }

  if (!Validations.email(req.body?.data?.email)) {
    return res
      .status(500)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_INVALID_EMAIL", error: true });
  }

  const email = req.body.data.email.toLowerCase();
  const userByEmail = await Data.getUserByEmail({ email });
  if (userByEmail) {
    return res
      .status(409)
      .send({ decorator: "SERVER_CREATE_VERIFICATION_EMAIL_TAKEN", error: true });
  }

  const pin = Utilities.generateRandomNumberInRange(111111, 999999);
  const verification = await Data.createVerification({
    email,
    pin,
  });

  if (!verification) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }
  if (verification.error) {
    return res.status(404).send({ decorator: "SERVER_CREATE_VERIFICATION_FAILED", error: true });
  }

  const confTemplateId = "d-823d8ae5e838452f903e94ee4115bffc";
  const slateEmail = "hello@slate.host";

  const sentEmail = await EmailManager.sendTemplate({
    to: email,
    from: slateEmail,
    templateId: confTemplateId,
    templateData: { confirmation_code: pin },
  });

  if (sentEmail?.error) {
    return res.status(500).send({ decorator: sentEmail.decorator, error: true });
  }

  return res.status(200).send({
    decorator: "SERVER_CREATE_VERIFICATION",
    token: verification.sid,
  });
};
