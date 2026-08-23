use axum::Router;
use tower::ServiceBuilder;
use tower_http::services::ServeFile;
use vercel_runtime::{Error, axum::VercelLayer};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = Router::new().route_service("/", ServeFile::new("templates/index.html"));

    let app = ServiceBuilder::new()
        .layer(VercelLayer::new())
        .service(router);

    vercel_runtime::run(app).await
}
