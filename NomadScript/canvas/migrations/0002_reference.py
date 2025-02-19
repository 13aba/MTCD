# Generated by Django 5.0.1 on 2024-11-30 12:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("canvas", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Reference",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("label", models.CharField(max_length=50, unique=True)),
                ("image", models.ImageField(upload_to="media/Letters/")),
            ],
        ),
    ]
