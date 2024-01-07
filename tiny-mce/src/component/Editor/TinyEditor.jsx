"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";
const TinyEditor = () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const handlerImageUpload = (blobInfo, success, failure) => {
    return new Promise(async (resolve, reject) => {
      const file = blobInfo.blob();
      const fileName = blobInfo.filename();
      const { data, error } = await supabase.storage
        .from("image")
        .upload(uuid(), file);
      if (data) {
        const imageUrl = data.path;
        success(imageUrl);
        resolve(
          `https://ulpjugqpjzizahxbjstt.supabase.co/storage/v1/object/public/image/${imageUrl}`
        );
      } else {
        console.log(error);
        reject(error);
      }
    });
  };

  return (
    <>
      <Editor
        apiKey="r867q9o4rl69mxxxwmj4ok0xypnt6hswpfhcaeq27kxma3wz"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          skin: "snow",
          icons: "thin",
          plugins: "autoresize quickbars image media table hr paste",
          toolbar: false,
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          quickbars_selection_toolbar: "bold italic link | h1 h2 | blockquote",
          quickbars_insert_toolbar: "image media table hr",
          a11y_advanced_options: true,
          file_picker_types: "image",
          images_upload_handler: handlerImageUpload,
        }}
      />
      <input
        id="my-file"
        type="file"
        name="my-file"
        style={{ display: "none" }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
};

export default TinyEditor;
