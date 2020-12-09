package br.com.popolin.barbers;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  @Override
  protected void onCreate(Bundle saveInstanceState){
    SplashScreen.show(this);
    super.onCreate(saveInstanceState);
  }

  @Override
  protected String getMainComponentName() {
    return "appgobarber";
  }
}
