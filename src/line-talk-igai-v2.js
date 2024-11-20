while (true) {
  app.launch("jp.naver.line.android");
  click("ホーム");
  click("VOOM");
  for (let i = 0; i < 100; i++) {
    scrollUp();
  }
}
