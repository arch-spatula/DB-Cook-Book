[Firebase – Full Course for Beginners](https://www.youtube.com/watch?v=fgdpvwEWJ9M)

```js
import { db, auth } from "./firebase.js";
import {
  collection,
  query,
  where,
  doc,
  orderBy,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";
import { $ } from "./util.js";

const addTodo = $(`#add-todo`);
const listsContainer = $(`#lists-container`);
const addBTN = $(`#create-list-item`);
const updateBTN = $(`#update-list-item`);
updateBTN.style.display = `none`;

export const createTodo = async (event) => {
  // console.log(addTodo.value, auth.currentUser.uid);
  if (addTodo.value) {
    try {
      await addDoc(collection(db, "todos"), {
        todoItem: addTodo.value,
        addedDate: Date.now(),
        user: auth.currentUser.uid,
      });
      readTodo();
      addTodo.value = "";
    } catch (error) {
      console.log("error:", error);
    }
  }
};

export const readTodo = async () => {
  const todoList = [];
  try {
    listsContainer.textContent = "";
    const q = query(collection(db, "todos"), orderBy("addedDate"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      todoList.push({ ...doc.data(), id: doc.id });
    });
  } catch (error) {
    console.log("error:", error);
  }
  todoList.forEach(({ todoItem, id }) => {
    listsContainer.append(renderTodo(todoItem, id));
  });
};

// 임시저장하기
const todoItemPayload = {};
export const editTodo = (event) => {
  const listText = event.target.parentNode.firstElementChild.textContent;
  addTodo.value = listText;
  addTodo.focus();
  addBTN.style.display = "none";
  updateBTN.style.display = "inline-block";
  // 선택하기
  todoItemPayload.id = event.target.parentNode.id;
  // TODO 편집 취소 버튼 추가하기
};

// 업데이트에서 편집으로 업데이트하기
export const updateTodo = async () => {
  const docRef = doc(db, "todos", todoItemPayload.id);
  // 수정하고 보내기
  await updateDoc(docRef, { todoItem: addTodo.value });
  addTodo.value = "";
  todoItemPayload.id = "";
  readTodo();
};

export const deleteTodo = async (event) => {
  const docRef = doc(db, "todos", event.target.parentNode.id);
  await deleteDoc(docRef)
    .then(() => {
      console.log("삭제 성공");
      readTodo();
    })
    .catch(() => console.log("삭제 실패"));
};

const renderTodo = (todoItem, id) => {
  /*
    <li class="list-item">
        <p>할 일</p>
        <button onclick="updateTodo(event)">Update</button>
        <button onclick="deleteTodo(event)">Delete</button>
    </li>
  */
  const listItem = document.createElement("li");
  listItem.classList.add("list-item");
  listItem.setAttribute("id", id);

  const todoItemTag = document.createElement("p");
  todoItemTag.textContent = todoItem;
  listItem.append(todoItemTag);

  const updateBTN = document.createElement("button");
  updateBTN.textContent = "Update";
  updateBTN.setAttribute("onclick", "editTodo(event)");
  listItem.append(updateBTN);

  const deleteBTN = document.createElement("button");
  deleteBTN.textContent = "Delete";
  deleteBTN.setAttribute("onclick", "deleteTodo(event)");
  listItem.append(deleteBTN);
  return listItem;
};
```

firestore에서 간단하게 CRUD하는 방법입니다.

```js
export const socialLogin = (event) => {
  const { name } = event.target;
  let provider;
  if (name === "google") {
    provider = new GoogleAuthProvider();
  } else if (name === "github") {
    provider = new GithubAuthProvider();
  }
  signInWithPopup(authService, provider)
    .then((result) => {
      const user = result.user;
      console.log("소셜 로그인성공");
      closePopup();
    })
    .catch((error) => {
      // Handle Errors here.
      console.log("error:", error);
      const errorCode = error.code;
      const errorMessage = error.message;
    });
};
```

```js
createUserWithEmailAndPassword(authService, signupEmailVal, signupPwVal)
  .then((userCredential) => {
    // Signed in
    console.log("회원가입 성공!");
    console.log(userCredential);
    closePopup();
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log("errorMessage:", errorMessage);
    if (errorMessage.includes("email-already-in-use")) {
      alert("이미 가입된 이메일입니다.");
    }
  });
```

```js
signInWithEmailAndPassword(authService, loginEmailVal, pwVal)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log("errorMessage:", errorMessage);
    if (errorMessage.includes("user-not-found")) {
      alert("가입되지 않은 회원입니다.");
      return;
    } else if (errorMessage.includes("wrong-password")) {
      alert("비밀번호가 잘못 되었습니다.");
    }
  });
```

```js
export const logout = () => {
  signOut(authService)
    .then(() => {
      // Sign-out successful.
      localStorage.clear();
      console.log("로그아웃 성공");
    })
    .catch((error) => {
      // An error happened.
      console.log("error:", error);
    });
};
```

```js
/**
 * @todo 서버에서 프로필 이미지 가져오기
 * @todo 서버에서 프로필 이미지 보내기
 * @see https://github.com/rjc1704/Firebase-Lecture-by-Vanilla-JS/blob/master/js/pages/profile.js
 *
 * photoURL을 유저에게서 얻어와 활용합니다.
 *
 * 파이어 베이스 storage 공식 문서
 * @see https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0
 */

import { $ } from "./util.js";
import { authService, storageService } from "./firebase.js";
import {
  ref,
  uploadString,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

export const changeProfile = async (event) => {
  event.preventDefault();
  /**
   * 반복 제출을 막기 위해서 disabled시킵니다.
   *
   * @todo 아래의 내역은 나중에 진행합니다.
   * 더 좋은 사용자 경험을 위해서는 3초만 비활성화를 합니다.
   * 비활성화 되어 있는 동안 버튼은 회색으로 변형합니다.
   * 변형이 가능해질 때 본래 색으로 돌아옵니다.
   */
  $("#submit-btn").disabled = true;
  // 첫번째 인자는 사용할 서비스의 주체를 알아내기 위해 넣어줘야 합니다.
  const imgRef = ref(
    storageService, // ref함수는 storageService를 첫번째 인자로 받아야 합니다.
    `${authService.currentUser.uid}/${uuidv4()}` // 파일 이름의 형식으로 업로드할 수 있습니다. 유저명을 폴더이름으로 지정합니다. 폴더에 넣을 이미지 이름은 uuidv4 해쉬 값을 활용합니다.
  );
  const profileName = $("#profile-name").value;
  // 프로필 이미지 dataUrl을 Storage에 업로드 후 다운로드 링크를 받아서 photoURL에 저장.
  const imgDataUrl = localStorage.getItem("imgDataUrl");
  /** 외부 스코프에 두어서 참조값을 업데이트합니다. DB에 해당하는 이미지가 있으면 string 없으면 undefined가 됩니다. */
  let downloadUrl = null;
  if (imgDataUrl) {
    const response = await uploadString(imgRef, imgDataUrl, "data_url"); // https://firebase.google.com/docs/storage/web/upload-files?hl=en&authuser=0#upload_from_a_string
    downloadUrl = await getDownloadURL(response.ref); // https://firebase.google.com/docs/reference/js/v8/firebase.storage.Reference#getdownloadurl
  }
  await updateProfile(authService.currentUser, {
    displayName: profileName ? profileName : null,
    photoURL: downloadUrl ? downloadUrl : null,
  })
    .then(() => {
      alert("프로필 수정 완료");
      window.location.hash = "";
    })
    .catch((error) => {
      alert("프로필 수정 실패");
      console.log("error:", error);
    });
};

export const onFileChange = async (event) => {
  const uploadedFile = event.target.files[0];

  /** @see https://developer.mozilla.org/ko/docs/Web/API/FileReader */
  const reader = new FileReader();
  reader.readAsDataURL(uploadedFile);
  reader.onload = (finishedEvent) => {
    const imgDataUrl = finishedEvent.currentTarget.result;
    localStorage.setItem("imgDataUrl", imgDataUrl);
    document.getElementById("Profile-img").src = imgDataUrl;
  };
};
```

```js
import { auth } from "./firebase.js";
import { $ } from "./util.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";

/*
모의계정1
qwer.admin@zxcv.kr
123456

모의계정2
asdf.user@zxcv.kr
567890
*/

// window 전역변수 접근
export const handleLogin = (event) => {
  event.preventDefault();
  const id = $(`#login-email`).value;
  const pw = $(`#login-password`).value;
  console.log(id, pw);
  signInWithEmailAndPassword(auth, id, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("user", user);
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log("로그인 실패", errorMessage);
    });
};

export const handleSignup = (event) => {
  event.preventDefault();
  const id = $(`#signup-email`).value;
  const pw = $(`#signup-password`).value;
  createUserWithEmailAndPassword(auth, id, pw)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("user", user);
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log("회원가입 실패", errorMessage);
    });
};

export const handleLogout = () => {
  signOut(auth)
    .then(() => console.log("로그아웃 성공"))
    .catch((error) => console.log(error));
};
```

```js
//App.js

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
...
React.useEffect(() => {
        async function fetchData() {
            const bucket = await getDocs(collection(db, "bucket"));
            bucket.forEach((doc) => {
                console.log(doc.id, doc.data());
            });
        }
        fetchData();

        return () => {};
    }, []);
```

```js
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
...
React.useEffect(() => {
        async function fetchData() {
            const docRef = await addDoc(collection(db, "bucket"), {
                completed: false,
                text: "new",
            });
        }
        fetchData();

        return () => {};
    }, []);
```

```js
import { db } from "./firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
...
React.useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "bucket", "bucket_item");
            await updateDoc(docRef, {
                completed: true,
            });
        }
        fetchData();

        return () => {};
    }, []);

```

```js
import { db } from "./firebase";
import { collection, doc, deleteDoc } from "firebase/firestore";
...
React.useEffect(() => {
        async function fetchData() {
            const docRef = doc(db, "bucket", "bucket_item");
            await deleteDoc(docRef);
        }
        fetchData();

        return () => {};
    }, []);
```

```js
// bucket에서 buckets로 이름 바꾸기! 그리고 대시보드를 확인해보세요!
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
...
React.useEffect(() => {
        async function fetchData() {
            const docRef = await addDoc(collection(db, "buckets"), {
                completed: false,
                text: "new",
            });
        }
        fetchData();

        return () => {};
    }, []);
```
