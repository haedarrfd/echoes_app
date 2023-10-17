"use server";

import { revalidatePath } from "next/cache";
import Echo from "../models/echo.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createEcho({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdEcho = await Echo.create({
      text,
      author,
      community: communityIdObject,
    });

    // Update User Model
    await User.findByIdAndUpdate(author, {
      $push: { echos: createdEcho._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { echos: createdEcho._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating echo: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // Fetch the posts that have no parents
  const postsQuery = Echo.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Echo.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

export async function fetchEchoById(echoId: string) {
  connectToDB();

  try {
    const echo = await Echo.findById(echoId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      }) // Populate the author field with _id and username
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      }) // Populate the community field with _id and name
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Echo, // The model of the nested children (assuming it's the same "Echo" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return echo;
  } catch (error: any) {
    throw new Error(`Error fetching echo: ${error.message}`);
  }
}

export async function addCommentToEcho(
  echoId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original echo by its id
    const originalEcho = await Echo.findById(echoId);

    if (!originalEcho) {
      throw new Error("Echo not found");
    }

    // Create a new echo with the comment text
    const commentEcho = new Echo({
      text: commentText,
      author: userId,
      parentId: echoId,
    });

    // Save the new echo to database
    const savedCommentEcho = await commentEcho.save();

    // Update the original echo to include the new comment
    originalEcho.children.push(savedCommentEcho._id);

    // Save the original echo
    await originalEcho.save();

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to echo: ${error.message}`);
  }
}

export async function fetchAllChildEchoes(echoId: string): Promise<any[]> {
  const childEchoes = await Echo.find({ parentId: echoId });
  const descendantEchoes = [];

  for (const childEcho of childEchoes) {
    const descendants = await fetchAllChildEchoes(childEcho._id);
    descendantEchoes.push(childEcho, ...descendants);
  }

  return descendantEchoes;
}

export async function deleteEcho(id: string, path: string): Promise<void> {
  try {
    connectToDB();

    // Find the Echo to be deleted (the main Echo)
    const mainEcho = await Echo.findById(id).populate("author community");

    if (!mainEcho) {
      throw new Error("Echo not found");
    }

    // Fetch all child Echo and their descendants recursively
    const descendantEchoes = await fetchAllChildEchoes(id);

    // Get all descendant Echo IDs including the main Echo ID and child Echo IDs
    const descendantEchoIds = [id, ...descendantEchoes.map((echo) => echo._id)];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantEchoes.map((echo) => echo.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainEcho.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantEchoes.map((echo) => echo.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainEcho.community?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child echoes and their descendants
    await Echo.deleteMany({ _id: { $in: descendantEchoIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { echos: { $in: descendantEchoIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { echos: { $in: descendantEchoIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
