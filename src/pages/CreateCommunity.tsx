import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/supabase-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(4, "Minimal 4 character").nonempty("Name is required"),
  description: z
    .string()
    .min(7, "Minimal 7 character")
    .nonempty("Description is required"),
});

type Schema = z.infer<typeof schema>;

const createCommunity = async (values: Schema): Promise<void> => {
  const { error } = await supabase.from("community").insert({
    title: values.name,
    description: values.description,
  });

  if (error) throw new Error(error.message);
};

const CreateCommunity = () => {
  const navigate = useNavigate();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { handleSubmit, control, reset } = form;

  const { mutate, error, isPending } = useMutation({
    mutationFn: createCommunity,
    onSuccess: () => {
      reset();
      navigate("/communities");
      toast.success("Community has been created");
    },
    onError: (error: Error) => {
      console.error(`Failed: ${error.message}`);
      toast.error("Failed to create community. Please try again or login.");
    },
  });

  const onSubmit = (values: Schema) => {
    mutate(values);
  };

  return (
    <main className="flex justify-center pt-10 pb-30 md:pb-10 px-4 min-h-[calc(100vh-50px)] items-center md:items-start  md:min-h-screen bg-black">
      <div className="w-full max-w-xl flex flex-col gap-6 items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500 drop-shadow-md text-center">
          Create New Community
        </h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-5">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full grid gap-1">
                  <FormLabel className="text-white text-lg">Community name</FormLabel>
                  <FormControl>
                    <Input
                      className="text-white placeholder:text-gray-500 border-gray-800 border-2 outline-none"
                      placeholder="Input community name..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full grid gap-1">
                  <FormLabel className="text-white text-lg">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="text-white placeholder:text-gray-500 border-gray-800 resize-none h-20 border-2 outline-none"
                      placeholder="Input description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isPending}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 font-semibold text-base"
            >
              {isPending ? "Creating Community..." : "Create Community"}
            </Button>
          </form>
        </Form>

        {error && (
          <p className="text-red-500 text-center text-base sm:text-lg font-semibold w-full">
            Failed to create community
          </p>
        )}
      </div>
    </main>
  );
};

export default CreateCommunity;
