# MyTranslationService

네이버 개발자 센터에서 제공하는 API서비스 중 뉴스,백과사전 등의 데이터를 
사용자가 질의/요청한 시점에 해당 결과 데이터를 API 형태로 제공해주는 서비스가 있습니다.

검색 API에서 리턴되는 텍스트 데이터 중 <HTML> 태그를 제거하고, 해당 데이터의 번역을 통해
영어/일어/중국어로 텍스트 형태 뿐만아니라 음성 데이터로 제공한다면 활용도가 높지 않을까 생각합니다.

뉴스나 알고싶은 지식(백과사전)을 한글 질의어로 검색하고, 네이버 검색엔진의 결과를 API로 받아서
네이버 클라우드 플랫폼의 서비스를 활용해서 사용자의 입맛에 맞는 결과물을 제공할 수 있을 것으로 기대하고 있습니다.

#### Used External API

### NAVER Search API
검색어 입력 후 NAVER Search API를 통해 결과 값을 반환합니다.

### PapagoNMT API
검색된 결과값을 영문으로 번역합니다.

### Clova CSS API
번역된 영문 결과값을 합성하여 mp3파일로 저장합니다. 

