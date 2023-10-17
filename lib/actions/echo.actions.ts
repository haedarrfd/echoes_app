"use server";

import { revalidatePath } from "next/cache";
import Echo from "../models/echo.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createEcho({ text, author, communityId, path }: Params) {
  try {
    connectToDB();

    const createdEcho = await Echo.create({ text, author, community: null });

    // Update User Model
    await User.findByIdAndUpdate(author, {
      $push: { echos: createdEcho._id },
    });

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
    .sort({
      createdAt: "desc",
    })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
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
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Echo,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
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
