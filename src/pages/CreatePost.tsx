import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/supabase-client";
import { useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { getCommunities, type Community } from "./Communities";

const schema = z.object({
  title: z.string().nonempty("Title is required").min(5, "Minimal 5 Character"),
  content: z
    .string()
    .nonempty("Content is required")
    .min(3, "Minimal 3 character"),
  community: z.string(),
  image: z.any().optional(),
});

type Schema = z.infer<typeof schema>;

const createPost = async ({
  values,
  user,
}: {
  values: Schema;
  user: User | null;
}): Promise<void> => {
  let imageUrl: string | null = null;
  if (values.image) {
    const file = values.image as File;
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(fileName, file);
    if (uploadError) throw new Error(uploadError.message);

    const { data: image_url } = supabase.storage
      .from("post-images")
      .getPublicUrl(fileName);

    imageUrl = image_url.publicUrl;
  }

  let communityId = values.community === " " ? null : Number(values.community);

  const { error } = await supabase.from("posts").insert({
    title: values.title,
    content: values.content,
    community_id: communityId,
    image_url: imageUrl,
    avatar_url: user?.user_metadata.avatar_url ?? null,
  });
  if (error) throw new Error(error.message);
};

const CreatePost = () => {
  const user = useAuthStore((state) => state.user);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      content: "",
      community: undefined,
    },
  });

  const { data: communities } = useQuery<Community[], Error>({
    queryKey: ["community"],
    queryFn: getCommunities,
  });

  const { control, handleSubmit, reset } = form;

  const { mutate, isPending, isError } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Post has been created");
    },
    onError: () => {
      toast.error("Failed to Create Post, Try again or login");
    },
  });

  const onSubmit = (values: Schema) => {
    mutate({ values, user });
  };

  return (
    <div className="flex justify-center  pb-20 md:pb-10 md:pt-5 min-h-[calc(100vh-50px)] md:h-auto items-center md:items-center md:min-h-133 bg-black px-4 ">
      <div className="flex w-full max-w-[480px] md:max-w-[600px] flex-col gap-4 items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md text-center">
          Create New Post
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-4">
            {/* Title */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="text-white text-lg">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white placeholder:text-gray-500 border-gray-800 border-2 outline-none"
                      placeholder="Input your title..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Content */}
            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="text-white text-lg">Content</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-white placeholder:text-gray-500 border-gray-800 resize-none h-20 border-2 outline-none"
                      placeholder="Input your content..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Community */}
            <FormField
              control={control}
              name="community"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="text-white text-lg">
                    Select Community
                  </FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full text-white placeholder:text-gray-500 border-gray-800 border-2 outline-none">
                        <SelectValue placeholder="Select a community" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Community</SelectLabel>
                        <SelectItem value=" ">-- General --</SelectItem>
                        {communities?.map((community) => (
                          <SelectItem
                            value={community.id.toString()}
                            key={community.id}
                          >
                            {community.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image */}
            <FormField
              control={control}
              name="image"
              render={({ field }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="text-white text-lg">
                    Upload image (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                      className="text-white placeholder:text-gray-500 border-gray-800 border-2 outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={isPending}
              className="bg-fuchsia-500 hover:bg-fuchsia-400 cursor-pointer font-bold text-[16px] w-full"
            >
              {isPending ? "Creating..." : "Create Post"}
            </Button>

            {isError && (
              <p className="text-red-500 text-sm text-center">
                Error Creating Post
              </p>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreatePost;
