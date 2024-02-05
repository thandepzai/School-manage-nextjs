import { SchoolType } from "@/src/types/school.type";
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from "next";
import React from "react";

export interface SchoolDetailProps {
  data: SchoolType;
}

export default function SchoolDetail(props: SchoolDetailProps) {
  const { data } = props;
  return (
    <div
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <h1 style={{ textAlign: "center" }}>Detail School</h1>
      {JSON.stringify(data) !== '{}' ? (
        <div style={{ width: "800px", margin: "20px auto" }}>
          <h3 style={{ margin: "20px" }}>Name: {data?.schoolName}</h3>
          <h3 style={{ margin: "20px" }}>Address: {data?.address}</h3>
          <h3 style={{ margin: "20px" }}>Email: {data?.email}</h3>
          <h3 style={{ margin: "20px" }}>Hotline: {data?.hotline}</h3>
          <h3 style={{ margin: "20px" }}>
            Founding Year: {data?.dateEstablished}
          </h3>
          <h3 style={{ margin: "20px" }}>Description:{data?.description} </h3>
        </div>
      ) : (
        <>Loading...</>
      )}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const data = await fetch("http://localhost:8080/v1/school");
  let myProps = await data.json();
  return {
    paths: myProps.data.data.map((data: SchoolType) => ({
      params: { id: data.id },
    })),
    fallback: true, // false or "blocking"
  };
};

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext
) => {
  const postId = context.params?.id;
  if (!postId) return { notFound: true };
  const res = await fetch(`http://localhost:8080/v1/school/${postId}`);
  const post = await res.json();
  if(!post.status) return {props: {data: {}}}
  return {
    props: {
      data: post.data,
    }
  };
};
