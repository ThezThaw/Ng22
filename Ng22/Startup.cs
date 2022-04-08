using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Ng22.Backend;
using Ng22.Backend.Resource;
using Ng22.Helper;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Ng22DbContext = Ng22.Backend.Ng22DbContext;

namespace Ng22
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Config.LoadConfig(configuration);
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var mapperCfg = new MapperConfiguration(mc =>
            {
                mc.AddProfile(new Ng22MapperClass());
            });
            services.AddSingleton(mapperCfg.CreateMapper());

            services.AddScoped<IAppUserResource, AppUserResource>();
            services.AddScoped<IMissionResource, MissionResource>();
            services.AddScoped<ITwoFAResource, TwoFAResource>();
            services.AddScoped<IAccessRightResource, AccessRightResource>();
            services.AddScoped<IPushMessageResource, PushMessageResource>();
            services.AddScoped<IIPFilterResource, IPFilterResource>();
            services.AddScoped<IUserDbService, UserDbService>();
            services.AddScoped<IMissionDbService, MissionDbService>();
            services.AddScoped<ITwoFADbService, TwoFADbService>();
            services.AddScoped<IAccessRightDbService, AccessRightDbService>();
            services.AddScoped<IPushMessageDbService, PushMessageDbService>();
            services.AddScoped<IIPFilterDbService, IPFilterDbService>();
            services.AddDbContext<Ng22DbContext>(builder => builder
                .UseMySQL($"Database={Config.DbName};Data Source={Config.DbServer};Port={Config.DbPort};User Id={Config.DbUser};Password={Config.DbPassword};Charset=utf8;"));            
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer("L1", x =>
                    {
                        x.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuer = true,
                            ValidIssuer= "Ng22",
                            ValidateAudience = true,
                            ValidAudience="L1",

                            RequireExpirationTime = true,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.Zero,

                            RequireSignedTokens = true,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"))
                        };
                        x.Events = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = ctx =>
                            {
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = ctx =>
                            {
                                return Task.CompletedTask;
                            }
                        };
                    })
                    .AddJwtBearer("L2", x =>
                    {
                        x.TokenValidationParameters = new TokenValidationParameters()
                        {
                            ValidateIssuer = true,
                            ValidIssuer = "Ng22",
                            ValidateAudience = true,
                            ValidAudience = "L2",

                            RequireExpirationTime = true,
                            ValidateLifetime = true,
                            ClockSkew = TimeSpan.Zero,

                            RequireSignedTokens = true,
                            ValidateIssuerSigningKey = true,
                            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes("ng22-1234567890123456789"))
                        };
                        x.Events = new JwtBearerEvents
                        {
                            OnAuthenticationFailed = ctx =>
                            {
                                return Task.CompletedTask;
                            },
                            OnTokenValidated = ctx =>
                            {
                                return Task.CompletedTask;
                            }
                        };
                    });
            services.AddAuthorization();
            services.AddSwaggerGen(sw =>
            {
                sw.SwaggerDoc("ng22", new OpenApiInfo { Title = "Ng22" });
                sw.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    In = ParameterLocation.Header,
                    Description = "add bearer token",
                    Name = "Authorization",//this must be 'Authorization'
                    Type = SecuritySchemeType.ApiKey
                });
                sw.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Scheme = "oauth2",
                            Name = "Bearer",
                            In = ParameterLocation.Header
                        },
                        new List<string>()
                    }
                });
            });

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseCors(cors => cors.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader());
            app.UseAuthentication();
            app.UseAuthorization();//add after app.UseRouting();
            app.UseSwagger();
            app.UseSwaggerUI(sw => sw.SwaggerEndpoint("/swagger/ng22/swagger.json", "Ng22 Swagger"));
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                //if (env.IsDevelopment())
                //{
                //    spa.UseAngularCliServer(npmScript: "start");
                //}
            });
        }
    }
}