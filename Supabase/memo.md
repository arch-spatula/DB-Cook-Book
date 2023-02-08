# supabase

```usr
https://supabase.com/
```

수파베이스라고 발음할 수 있습니다.

|            | 장점                                                                                                        | 단점                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| supabase   | 파이어베스랑 다르게 리소스를 깔끔한 배열로 받을 수 있습니다. 그래서 리액트 쿼리로 통신추상화를 하기 좋습닏. |                                                        |
| firebase   | 상당히 많은 편의기능을 제공해줍니다.                                                                        | 독선적이고 플랫폼만의 방식을 적용해야 합니다.          |
| pocketbase | 가장 경량화된 BaaS입니다.                                                                                   | 하지만 만약 성공하게 된다면 마이그레이션이 필요합니다. |

파이어베이스 대체제로 부상하고 있습니다. 하지만 pocketbase보다는 부족합니다.

https://velog.io/@yjjjwww/supabase-prisma

```sh
npm install -g supabase
```

supabase는 CLI를 제공합니다. 만약 타입스크립트로 작성하고 있다면 테이블에 타이핑을 지정해줍니다.

# 에러로그: storage 비어있는 배열

## 문제: 어떻게해도 비어있는 배열로 응답을 받았습니다.

```tsx
const { data, error } = await supabase.storage.listBucke();
console.log(data); // []
```

모든 접근가능한 storage가 무엇인지 날리는 쿼리입니다.

이렇게 요청을 보내면 비어있는 배열만 반환받습니다.

## 시도: 공식 문서 참조

https://supabase.com/docs/reference/javascript/storage-createbucket

공식문서를 보고 자료를 참조했습니다.

```tsx
const { data, error } = await supabase.storage.getBucket("avatars");
```

```tsx
const { data, error } = await supabase.storage.updateBucket("avatars", {
  public: false,
});
```

쿼리와 뮤테이션에 응답을 받지 않았습니다.

## 해결

https://github.com/supabase/supabase/discussions/1761

권한을 모두에게 허용하도록 설정했습니다.

## 학습:
