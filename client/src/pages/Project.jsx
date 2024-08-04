import React from "react";
import { Box } from "@mui/material";

const Project = () => {
  return (
    <>
      <Box
        className="Main"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          background: "white",
          margin: 10,
        }}
      >
        <Box
          className="LeftSide"
          sx={{
            width: "35%",
            height: "100vh",
            border: "1px solid blue",
          }}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            obcaecati soluta sequi consequatur, pariatur vitae ullam atque vel
            re
          </p>
        </Box>
        <Box
          className="Right Side"
          sx={{
            width: "65%",
            height: "100vh",
            border: "1px solid red",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
            obcaecati soluta sequi consequatur, pariatur vitae ullam atque vel
            re
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            Consequatur eaque ipsam odit exercitationem eligendi veniam aperiam
            dolor neque soluta facere nemo distinctio, est praesentium quia
            vitae aliquid incidunt nesciunt fuga possimus libero sapiente! Nam
            enim, neque dolore ea eaque distinctio? Perferendis recusandae quasi
            facere asperiores blanditiis ducimus quia in soluta sit deserunt id
            aliquid tenetur architecto nobis neque quo aliquam praesentium,
            suscipit quos magni ab animi voluptatum? A, quae? Eaque eius porro
            commodi. Repellendus consequatur nisi, minima nam et recusandae
            quidem voluptatem. Velit qui harum aliquid, unde repellat quis eaque
            atque doloremque veniam corporis, deserunt numquam eos tenetur
            mollitia illum aliquam tempora animi exercitationem provident.
            Exercitationem ullam quis accusamus pariatur fugiat vel temporibus
            corporis, ipsum laborum alias sit. Modi accusamus voluptates
            molestias non porro aspernatur doloribus libero iure ipsa, ipsam
            vitae odit perferendis voluptas atque dolores neque debitis? Eaque
            fuga adipisci asperiores neque, autem ad. Sapiente tempora id fugiat
            suscipit. Corrupti error, quia amet debitis cupiditate nisi labore
            adipisci, optio officiis tenetur eum omnis possimus non ratione
            numquam sed ut deserunt fugiat libero voluptas vel, odit quas esse.
            Ipsam perspiciatis molestias eum aut ut repellendus, saepe iure
            expedita sit explicabo nesciunt cupiditate corporis, dolorem laborum
            ea eligendi labore placeat! Quo.
          </p>
        </Box>
      </Box>
    </>
  );
};

export default Project;
