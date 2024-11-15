# Generated by Django 5.1.3 on 2024-11-11 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('application', '0002_bandrequest'),
    ]

    operations = [
        migrations.AddField(
            model_name='band',
            name='is_approved',
            field=models.BooleanField(default=False, help_text='Indica si la banda ha sido aprobada por un administrador.'),
        ),
        migrations.DeleteModel(
            name='BandRequest',
        ),
    ]
