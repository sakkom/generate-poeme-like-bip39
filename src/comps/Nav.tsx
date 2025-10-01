import Link from "next/link";

export const Nav = () => {
  return (
    <div>
      <Link href={`/`}>
        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: 0,
            // backgroundColor: "black",
            // borderRight: "1px solid black",
            borderBottom: "1px solid black",
            color: "black",
            width: "calc(100dvw/5)",
            height: "30px",
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            paddingRight: "1vmin",
          }}
        >
          Home
        </div>
      </Link>
      <Link href={`/generate`}>
        <div
          style={{
            position: "absolute",
            bottom: "0px",
            left: `calc(100dvw/5)`,
            width: "calc(100dvw/5)",
            // backgroundColor: "black",
            borderTop: "1px solid black",
            borderRight: "1px solid black",
            borderLeft: "1px solid black",
            color: "black",
            height: "30px",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            paddingLeft: "1vmin",
          }}
        >
          Generate
        </div>
      </Link>

      <Link href={`/visit`}>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: `calc(100dvw/5 * 2)`,
            width: "calc(100dvw/5)",
            // backgroundColor: "black",
            borderRight: "1px solid black",
            borderBottom: "1px solid black",
            color: "black",
            height: "30px",
            display: "flex",
            alignItems: "end",
            justifyContent: "center",
            paddingRight: "1vmin",
          }}
        >
          Loggin
        </div>
      </Link>

      <Link href={`/create`}>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: `calc(100dvw/5 * 3)`,
            width: "calc(100dvw/5)",
            // backgroundColor: "black",
            // borderRight: "1px solid black",
            borderBottom: "1px solid black",
            color: "black",
            height: "30px",
            display: "flex",
            alignItems: "end",
            justifyContent: "end",
            paddingRight: "1vmin",
          }}
        >
          Opened
        </div>
      </Link>

      <Link href={`/create`}>
        <div
          style={{
            position: "absolute",
            bottom: "15px",
            left: `calc(100dvw/5 * 4)`,
            width: "calc(100dvw/5)",
            // backgroundColor: "black",
            borderLeft: "1px solid black",
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
            color: "black",
            height: "30px",
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
            paddingLeft: "1vmin",
          }}
        >
          Vocabulary
        </div>
      </Link>
    </div>
  );
};
