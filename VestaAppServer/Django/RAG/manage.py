
import os
import sys

def main() -> None:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

   
    try:
        from dotenv import load_dotenv
        load_dotenv()
    except Exception:
        pass

    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)

if __name__ == "__main__":
    main()
