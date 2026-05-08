import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'config/platform_config.dart';
import 'core/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: PlatformConfig.supabaseUrl,
    anonKey: PlatformConfig.supabaseAnonKey,
  );

  runApp(const PlatformApp());
}
