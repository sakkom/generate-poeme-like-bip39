export default function Page() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          color: "black",
          display: "flex",
          height: "90dvh",
          flexDirection: "column",
          maxWidth: "50%",
          alignItems: "start",
          overflowY: "scroll",
        }}
      >
        <h1>About</h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            poetryKey.appはNFTなデータ≒詩としPublicとPrivateの関係性の動向を探る.
            <br />
            WEB Interface: です.
            <br />
            詩は次のステップを踏み倫理的な在り方に進む.
          </div>

          <ol>
            <li>生成され宙に浮いた状態</li>
            <li>WEB空間では暗号化され現実空間で記憶される状態</li>
            <li>ブロックチェーン上でPublicな状態</li>
            <li>NFTにより著者所有の状態</li>
          </ol>
          <div>
            poetryKeyは上記の手順の2番目までの実装である.
            <br />
            暗号化された詩はWEB空間で
            別に目的はないが生まれた場所に戻れるってことが機能であるし、
            次の状態を解禁することもできる.
            <br />
            詩が最大の情報で匿名でPrivateな空間.
          </div>
          <div>
            <br />
            公開機能はある.
            <br />
            2.5番目の実装と言えるかもしれない.
            <br />
            いわゆるアプリ.
            <br />
            匿名か著者を選ぶことができる.
            <br />
            公開されているがデータはPublicでない.
            <br />
            ここでは私がもつ.
            <br />
            その状態では詩はWEB空間と仲良くてもサイバー空間と仲良くなれない.
            <br />
          </div>
          <div>
            2.5番目と3番目は大きな違い
            <br />
            ユーザの詩だから.
            <br />
            ユーザがつくる.
            <br />
          </div>
        </div>
      </div>
    </div>
  );
}
