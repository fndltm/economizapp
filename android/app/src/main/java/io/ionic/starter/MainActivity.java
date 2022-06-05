package io.ionic.starter;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.codetrixstudio.capacitor.GoogleAuth.GoogleAuth;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;
import com.getcapacitor.community.facebooklogin.FacebookLogin;

import java.util.ArrayList;

public class MainActivity extends BridgeActivity {
  void setDarkMode() {
    WebSettings webSettings = this.bridge.getWebView().getSettings();
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
      webSettings.setForceDark(WebSettings.FORCE_DARK_ON);
    }
    this.bridge.getWebView().evaluateJavascript("document.body.classList.toggle('dark', true);", null);
  }

  @Override
  public void onStart() {
    super.onStart();
    setDarkMode();
  }

  @Override
  public void onResume() {
    super.onResume();
    setDarkMode();
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      // Ex: add(TotallyAwesomePlugin.class);
      registerPlugin(GoogleAuth.class);
      registerPlugin(FacebookLogin.class);
    }});
  }
}
