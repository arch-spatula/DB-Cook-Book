# Supabase Tutorial #1 - What is Supabase?

https://www.youtube.com/watch?v=ydz7Dj5QHKY

수파베이스의 장점은 자유도가 높습니다. 그리고 SQL로 데이터베이스를 작성합니다.

사용자가 CRUD 가능한 예제를 다룹니다.

데이터 베이스를 공부를 시작하기 위한 강의입니다.

https://github.com/iamshaunjp/Supabase-Tutorial-for-Beginners

# Supabase Tutorial #2 - Connecting to Supabase

https://www.youtube.com/watch?v=Gz9bvYybaws

프로젝트를 만들면 화면에서 url과 key를 복사합니다. 프로젝트용 데이터베이스 보안 비밀번호도 자동 생성해줄 것입니다. 이런 정보는 보안을 위해 환경변수에 저장해둡니다.

.env에 저장합니다.

```sh
REACT_APP_SUPABASE_URL = 복붙한 URL
REACT_APP_ANON_KEY = 복붙한 APIKEY

# 자동생성한 DB 비번
```

참고로 모두 상수로 표기합니다.

DB 비번은 git에 안 올라가도록 합니다.

환경 변수는 다른 파일에서도 활용하고 접근할 수 있습니다.

```sh
npm install @supabase/supabase-js
```

npm 설치는 이렇게 하고 패키지 의존성을 추가합니다.

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "url";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
```

홈페이지를 보면 이렇게 스니펫을 제공한다는 것을 확인할 수 있습니다.

https://app.supabase.com/project/본인 프로젝트 URL/api

이 링크로 들어가서 복붙할 수 있습니다.

```txt
/root/src/config/supabaseClient.js
```

이렇게 폴더 속에 넣습니다.

그리고 코드를 약간 바꿉니다.

```js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```

환경 변수를 이렇게 작성합니다.

```js
import supabase from "../config/supabaseClient";
const Home = () => {
  console.log(supabase);
  return (
    <div className="page home">
      <h2>Home</h2>
    </div>
  );
};

export default Home;
```

supabase 연결을 확인합니다.

`console.log`에 `SupabaseClient`이 출력될 것입니다.

# Supabase Tutorial #3 - Fetching Data

https://www.youtube.com/watch?v=VjohMDwjty4

SQL 답게 table을 만들어야 합니다.

테이블 속에는 레코드가 존재하고 각각의 레코드에는 프라이머리 키로 구별합니다.

Enable Row Level Security (RLS)은 데이터베이스 접근권한을 설정할 때 사용합니다. 비로그인으로도 접근가능하게 됩니다.

Enable Realtime은 실시간 데이터 반영에 활용합니다.

테이블은 `https://app.supabase.com/project/본인 url/editor/숫자` 에서 작성합니다. 테이블 이름은 잘 기억하도록 합니다. 쿼리날릴 대상이 됩니다.

```js
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

const Home = () => {
  // console.log(supabase);
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase.from("smoothies").select();

      if (error) {
        setFetchError("가져오기 불가");
        setSmoothies(null);
        console.log(error);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, []);

  console.log(smoothies);

  return (
    <div className="page home">
      <h2>Home</h2>
    </div>
  );
};

export default Home;
```

> 0 : {id: 1, created_at: '2023-01-17T07:46:22.654102+00:00', title: '빠른 생성', method: '모름', rating: 1}
> 1 : {id: 2, created_at: '2023-01-17T07:47:15.630664+00:00', title: '제목인가?', method: 'ㄴㄴ', rating: 5}

이렇게 로그가 찍히는 것을 확인할 수 있습니다. 파이어베이스의 객체형 압제를 벗어날 수 있게 되었습니다.

```js
const { data, error } = await supabase.from("smoothies").select();
```

통신에서 중요한 것은 이부분입니다. `from`은 테이블을 선택합니다. `select`는 선택입니다. 대입하는 인자가 없으면 테이블 전체를 선택합니다.

# Supabase Tutorial #4 - Adding New Records

https://www.youtube.com/watch?v=dRVOhY-3iXY

이번 시간에는 생성을 배웁니다.

```js
import { useState } from "react";

const Create = () => {
  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    // 여기를 공부합니다.
    e.preventDefault();
  };

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button>Create Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default Create;
```

이렇게 시작합니다.

from을 제출할 때 동작하는 부분(`handleSubmit`)을 작성하면서 배울 것입니다.

```js
const handleSubmit = async (e) => {
  e.preventDefault();

  // 유효성을 검증합니다.
  if (!title || !method || !rating) {
    // 피드백
    setFormError("제목, 방법론, 평점을 모두 채워주세요");
    // 함수를 조기에 종료
    return;
  }

  const { data, error } = await supabase
    .from("smoothies")
    .insert([{ title, method, rating }])
    .select();

  if (error) {
    console.log(error);
    setFormError(error);
  }
  if (data) {
    console.log(data);
    setFormError(null);
  }
};
```

이렇게 작성할 수 있습니다. 일단 클라이언트 측면에서 먼저 유효성 검사를 진행합니다.

```js
const { data, error } = await supabase
  .from("smoothies")
  .insert([{ title, method, rating }])
  .select();
```

만약 통신에 성공하고 전송한 데이터를 돌려받고 싶으면 `select` 메서드를 붙입니다.

생성은 `from`으로 테이블을 선택하고 `insert`로 데이터를 보내는 방법으로 합니다.

# Supabase Tutorial #5 - Fetching Single Records

https://www.youtube.com/watch?v=eyRdcNhDcI4

상세페이지에 진입할 때는 전체를 쿼리할 필요가 없습니다. 이번에는 부분 쿼리하는 방법을 배웁니다.

```js
import { useParams } from "react-router-dom";

const Update = () => {
  const { id } = useParams();

  return (
    <div className="page update">
      <h2>Update {id}</h2>
    </div>
  );
};

export default Update;
```

상세페이지에서 id를 보는 법을 알 수 있습니다.

react-router-dom에서 라우팅 데이터를 얻어와 요청을 보내는 것이 상세페이지의 일반적인 패턴입니다.

```js
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "../config/supabaseClient";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        // 라우트 히스토리를 홈페이지로 교체합니다.
        navigate("/", { replace: true });
      }

      if (data) {
        setRating(data.rating);
        setMethod(data.method);
        setTitle(data.title);
        console.log("title", title, "method", method, "rating", rating);
      }
    };

    fetchSmoothies();
  }, [id, navigate]);

  return (
    <div className="page update">
      <h2>Update {id}</h2>
    </div>
  );
};

export default Update;
```

이렇게 작성되어 있습니다.

상세페이지를 위해 쿼리를 날리는 방법입니다.

```js
const { data, error } = await supabase
  .from("smoothies")
  .select()
  .eq("id", id)
  .single();
```

이렇게 id를 선택할 수 있습니다. url에는 id정보가 있습니다. 이 id정보를 react-router-dom으로 얻어오고 이 id를 활용해서 요청을 보냅니다.

특정 row를 선택할 때는 `eq` 메서드를 활용합니다. `eq`는 equals의 약자입니다. `id`에서 url `id`가 일치하는 row를 서버에서 선택하고 받게됩니다.

id는 프라미머리 키에 해당합니다.

single은 배열의 단일 원소를 달라는 의미가 됩니다.

# Supabase Tutorial #6 - Updating Records

https://www.youtube.com/watch?v=uMTJ8HzaVZk

업데이트는 간단합니다.

```js
const { data, error } = await supabase
  .from("recipes")
  .update({ title, method, rating })
  .eq("id", id)
  .single();
```

from으로 동일하게 테이블을 선택하고 update로 계산을 결정합니다. 마지막으로 id로 row를 선택하면 됩니다. 그리고 single로 전송한 객체를 배열이 아닌 객체를 반환해서 받습니다.

```js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [method, setMethod] = useState("");
  const [rating, setRating] = useState("");
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !method || !rating) {
      setFormError("Please fill in all the fields correctly.");
      return;
    }

    const { data, error } = await supabase
      .from("smoothies")
      .update({ title, method, rating })
      .eq("id", id);

    if (error) {
      setFormError("Please fill in all the fields correctly.");
    }
    if (data) {
      setFormError(null);
      navigate("/");
    }
  };

  useEffect(() => {
    const fetchSmoothie = async () => {
      const { data, error } = await supabase
        .from("smoothies")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }
      if (data) {
        setTitle(data.title);
        setMethod(data.method);
        setRating(data.rating);
      }
    };

    fetchSmoothie();
  }, [id, navigate]);

  return (
    <div className="page create">
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="method">Method:</label>
        <textarea
          id="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        />

        <label htmlFor="rating">Rating:</label>
        <input
          type="number"
          id="rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />

        <button>Update Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default Update;
```

전체 코드는 이렇게 되어 있습니다.

# Supabase Tutorial #7 - Deleting Records

https://www.youtube.com/watch?v=P7CkdtU5bWc

```js
import supabase from "../config/supabaseClient";
import { Link } from "react-router-dom";

const SmoothieCard = ({ smoothie }) => {
  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", smoothie.id)
      .single();

    if (error) {
      console.log(error);
    }
    if (data) {
      console.log(data);
    }
  };

  return (
    <div className="smoothie-card">
      <h3>{smoothie.title}</h3>
      <p>{smoothie.method}</p>
      <div className="rating">{smoothie.rating}</div>
      <div className="buttons">
        <Link to={"/" + smoothie.id}>
          <i className="material-icons">edit</i>
        </Link>
        <i className="material-icons" onClick={handleDelete}>
          delete
        </i>
      </div>
    </div>
  );
};

export default SmoothieCard;
```

```js
const { data, error } = await supabase
  .from("recipes")
  .delete()
  .eq("id", smoothie.id)
  .single();
```

삭제 요청을 날린 부분입니다. 화면은 데이터에 동기화되어 있지 않습니다. 이럴 때는 클라이언트 state를 바로 삭제하면 됩니다.

# Supabase Tutorial #8 - Updating Local State

https://www.youtube.com/watch?v=MeRk-5U9XVc

클라이언트 화면에서 state 삭제는 알아서 하도록 합니다. 이 문제는 리액트 문제입니다.

# Supabase Tutorial #9 - Ordering Data

https://www.youtube.com/watch?v=hxmJZCMYua0

요청을 날리면서 데이터의 순서를 맞추면서 날리는 법입니다.

어느정도 클라이언트 state 제어를 통해서 순서를 맞출 수 있습니다.

```js
import supabase from "../config/supabaseClient";
import { useEffect, useState } from "react";

// components
import SmoothieCard from "../components/SmoothieCard";

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState(null);
  const [orderBy, setOrderBy] = useState("created_at");

  const handleDelete = (id) => {
    setSmoothies((prevSmoothies) => {
      return prevSmoothies.filter((sm) => sm.id !== id);
    });
  };

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError("Could not fetch the smoothies");
        setSmoothies(null);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, [orderBy]);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {smoothies && (
        <div className="smoothies">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("title")}>Title</button>
            <button onClick={() => setOrderBy("rating")}>Rating</button>
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
```

예를 들어 전체 코드입니다.

```js
const [fetchError, setFetchError] = useState(null);
const [smoothies, setSmoothies] = useState(null);
const [orderBy, setOrderBy] = useState("created_at");
```

useState로 정렬할 유형을 정하고 제어합니다. 생성일이 초기값입니다.

```js
<button onClick={() => setOrderBy("created_at")}>
  Time Created
</button>
<button onClick={() => setOrderBy("title")}>Title</button>
<button onClick={() => setOrderBy("rating")}>Rating</button>
```

버튼을 클릭하는 것으로 유형을 정합니다.

```js
const { data, error } = await supabase
  .from("recipes")
  .select()
  .order(orderBy, { ascending: false });
```

order 메서드를 체이닝해서 요청을 보내면 정렬은 서버가 계산해서 가져옵니다. 클라이언트가 계산하기 클 때는 활용할 수 있는 방법입니다.

두번째 인자 객체로 옵션을 결정할 수 있습니다. `ascending`로 제어할 수 있습니다.

# Supabase Tutorial #10 - Intro to RLS & Policies

RLS입니다. 키만 있으면 모든 통신이 가능합니다. 데이터를 보호하고 싶으면 백엔드로 보호해야 합니다.

로우레벨 보안입니다. 데이터의 룰을 지정할 수 있습니다. 비로그인 유저는 R만 허용하고 로그인 유저는 CUD같은 뮤테이션을 허용하게 만들 수 있습니다.

RLS를 활성화 버튼을 누릅니다.

활성화하면 모든 데이터베이스를 보호하기 시작하는 것입니다. 접근과 뮤테이션에 제약을 걸어두기 위한 행위입니다. 처음에 비로그인 유저에게는 R도 제한됩니다.

커머스처럼 비로그인에 R이 가능하고 로그인시 CUD가 가능하게 해야 합니다.

New Polices 버튼을 클릭합니다. 자주 사용하는 패턴들을 제공해줄 것입니다.

```SQL
CREATE POLICY "policy_name"
ON public.smoothies
FOR SELECT USING (
  true
);
```

이렇게 정책을 자동생성해줍니다.

정책은 복수로 만들 수 있습니다.
