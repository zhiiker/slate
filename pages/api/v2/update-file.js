import * as Strings from "~/common/strings";
import * as Data from "~/node_common/data";
import * as SearchManager from "~/node_common/managers/search";
import * as ViewerManager from "~/node_common/managers/viewer";
import * as RequestUtilities from "~/node_common/request-utilities";

export default async (req, res) => {
  const userInfo = await RequestUtilities.checkAuthorizationExternal(req, res);
  if (!userInfo) return;
  const { id, key, user } = userInfo;

  if (!req.body?.data?.id) {
    return res.status(500).send({ decorator: "NO_FILE_ID_PROVIDED", error: true });
  }

  //NOTE(martina): cleans the input to remove fields they should not be changing like ownerId, createdAt, filename, size, type etc.
  let updates = {
    id: req.body.data.id,
    isPublic: req.body.data.isPublic,
    data: {
      name: req.body.data.data?.name,
      body: req.body.data.data?.body,
      source: req.body.data.data?.source,
      author: req.body.data.data?.author,
    },
  };

  const file = await Data.getFileById({ id: updates.id });

  if (file.ownerId !== user.id) {
    return res.status(400).send({
      decorator: "NOT_FILE_OWNER_UPDATE_NOT_PERMITTED",
      error: true,
    });
  }

  if (typeof updates.isPublic !== "undefined" && updates.isPublic !== file.isPublic) {
    let response = await Data.updateFilePrivacy({
      ownerId: file.ownerId,
      id: updates.id,
      isPublic: updates.isPublic,
    });

    if (!response || response.error) {
      return res.status(500).send({ decorator: "UPDATE_FILE_PRIVACY_FAILED", error: true });
    }

    if (response.isPublic) {
      SearchManager.updateFile(response, "ADD");
    } else {
      SearchManager.updateFile(response, "REMOVE");
    }
  }

  let response = await Data.updateFileById(updates);

  if (!response || response.error) {
    return res.status(500).send({ decorator: "UPDATE_FILE_FAILED", error: true });
  }

  if (response.isPublic) {
    SearchManager.updateFile(response, "EDIT");
  }

  ViewerManager.hydratePartial(user.id, { library: true, slates: true });

  return res.status(200).send({
    decorator: "UPDATE_FILE",
    file: response,
  });
};
